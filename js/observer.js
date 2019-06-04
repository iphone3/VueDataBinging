function Observer(data) { // 监听器
	this.walk(data);
}

Observer.prototype = {
	walk(data) {
		if(!data || typeof data !== 'object') {
			return false
		}

		Object.keys(data).forEach(key => { // 遍历操作
			this.defineProperty(data, key, data[key])
		})
	},
	defineProperty(data, key, val) { // set/get方法
		this.walk(val) // key 对应的又是 字典对象时

		// 订阅器
		var dep = new Dep()

		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: false,
			get() {
				if(Dep.target) { // 符合某个条件说明是新的订阅者，才进行添加操作
					// Dep.target存储的就是Watcher实例
					dep.addSub(Dep.target)
				}

				return val;
			},
			set(newVal) {
				if(val !== newVal) {
					val = newVal

					// 通知订阅者
					dep.notify()
				}
			}
		})
	}
}

// 测试数据
//var zhangsan = {
//	name: '张三',
//	age: 18,
//	score:{
//		math: 100,
//		english:90
//	}
//}
//
//// 添加监听
//new Observer(zhangsan)
//
//zhangsan.age = 20
//zhangsan.score.english = 99