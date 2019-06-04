function Compiler(vm, el){
    this.vm = vm		// Vue对象
    this.el = document.querySelector(el)		// 挂载点
    this.fragment = null		// 文档片段
    this.init()	// 初始化
}

Compiler.prototype = {
    init(){
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el) // 文档片段
            this.compileElement(this.fragment)  // 解析
            this.el.appendChild(this.fragment)  // 将文档片段添加到视图中
        } else {
            console.log('Dom元素不存在');
        }
    },
    nodeToFragment(el){	// 文档片段处理
	    	var fragment = document.createDocumentFragment()
	    var child = el.firstChild
	    while (child) {
	        fragment.appendChild(child)
	        child = el.firstChild
	    }
	    return fragment
    },
    compileElement(fragment){	// 解析元素节点
	    	var childNodes = fragment.childNodes;
	
	    [].slice.call(childNodes).forEach(node=>{
	    		var reg = /\{\{(.*)\}\}/
        		var text = node.textContent
	        
	        if(this.isElementNode(node))	{	// 元素节点
	        		this.compileAttr(node)
	        } else if (this.isTextNode(node) && reg.test(text)) {	// 文本节点
	            this.compileText(node, reg.exec(text)[1])
	        }
	
	        // 继续递归遍历当前节点的子节点
	        if (node.childNodes && node.childNodes.length) {
	            this.compileElement(node);
	        }
	    });
    },
    isElementNode(node){	// 元素节点
    		return node.nodeType === 1
    },
    isTextNode(node){	// 文本节点
    		return node.nodeType === 3
    },
    compileAttr(node){	// v-xxx的处理
    		// 获取当前节点上所有的属性节点
    		var nodeAttrs = node.attributes;
    		var self = this;
    		
    		// 遍历属性，找到是否有v-xxx
    		[].slice.call(nodeAttrs).forEach(attr=>{
    			var attr_name = attr.name
    			
    			var reg = /v\-/;
    			
    			if(reg.test(attr_name)){		// v-xxx指令
    				var exp = attr.value		// 对应的事件
    				let dir = attr_name.substring(2)		// 字符串切分 v-   xxx
    				
    				reg = /on\:/;
    				if(reg.test(dir)){	// v-on事件绑定
    					self.compileEvent(node, self.vm, exp, dir)
    				} else{	// v-model双向数据绑定	[备注: 我们只做几个指令操作]
    					self.compileModel(node, self.vm, exp, dir)
    				}
    				
    				
    				// 操作完成后，删除对应的属性
    				node.removeAttribute(attr_name)
    			}
    		})
    },
    compileText(node, exp){	// {{}}的处理
    		var val = this.vm[exp]	// 获取属性值
    		node.textContent = val	// 更新到页面中
    		new Watcher(this.vm, exp, value=>{ // 新的订阅者(绑定更新函数即可)
        		node.textContent = value
    		})
    },
    compileEvent(node, vm, exp, dir){	// v-on的处理
    		// 例如   v-on:click='xxxx'
    		// 获取事件类型
    		var eventType = dir.split(':')[1]
    		// 根据事件名，获取函数句柄
    		var callback = vm.methods && vm.methods[exp]
    		if(eventType && callback){	// 有事件名且定义有对应事件处理
    			node.addEventListener(eventType, callback.bind(vm), false)
    		} else {
    			console.log('请在methods中添加对应的方法: ' + exp)
    		}
    },
    compileModel(node, vm, exp, dir){	// v-model的处理，为model绑定input事件
    		var val = this.vm[exp]	// 获取属性值
    		node.value = val	 // 更新到页面中
    		new Watcher(this.vm, exp, value=>{ // 新的订阅者(绑定更新函数即可)
        		node.value = value
    		})
    		
    		node.addEventListener('input', e => {
	        let newVal = e.target.value
	        if (val == newVal) {
	            return false
	        }
	        this.vm[exp] = newVal
	        val = newVal
	    }, false)
    }
}