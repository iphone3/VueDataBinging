// vm Vue的实例
// exp data中的key
// cb 回调函数
function Watcher(vm, exp, cb) {
	this.vm = vm
	this.exp = exp
	this.cb = cb

	// 获取key对应的值，同时将watcher添加到Dep的队列中
	this.value = this.get()
}

Watcher.prototype = {
	get() { // 获取数据时，添加订阅者
		// 添加一个标识的意思
		Dep.target = this

		// 获取值，即触发get方法 [添加订阅者]
		var val = this.vm[this.exp]

		// 已经添加完成
		Dep.target = null

		return val
	},
	update() { // 更新界面
		this.run()
	},
	run() {
		var val = this.vm[this.exp]

		if(val != this.value) { // 新值和旧值判断
			var oldValue = this.value
			this.value = val
			this.cb.call(this.vm, val, oldValue) // 回调函数
		}
	}
}