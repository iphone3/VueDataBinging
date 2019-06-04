function Vue(options) {
	this.el = options.el
	this.data = options.data
	this.methods = options.methods

	Object.keys(this.data).forEach(key => { // 数据代理
		this.proxyKeys(key)
	})
	new Observer(this.data) // 监听器	
	new Compiler(this, this.el) // DOM解析
}

Vue.prototype = {
	proxyKeys(key) {
		var self = this
		Object.defineProperty(this, key, {
			enumerable: false,
			configurable: true,
			get() {
				return self.data[key]
			},
			set(newVal) {
				self.data[key] = newVal
			}
		})
	},
}