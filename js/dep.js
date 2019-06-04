function Dep(){	// 订阅器
	this.subs = []
}

Dep.prototype = {
	addSub(watcher){		// 添加订阅者
		this.subs.push(watcher)
	},
	
	notify(){	// 通知订阅者
		this.subs.forEach(watcher=>{
			watcher.run()
		})
	}
}