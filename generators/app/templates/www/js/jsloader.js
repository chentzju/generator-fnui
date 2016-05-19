/*=============================================================
requirejs�������ԭ��

	1��require�ļ�ʵ��
		require(dep,callback)
	ǰ�����������������лص�������Ҫ������������ɺ���ܽ��лص�
	
	2�����ʵ�֣�
		ajax? : ������Ҫ���� ���� ��Ϊajax���ڿ�������
		requirejs ���������   ʵ��script ��ǩ���м���
		
		ex(from requirejs): ��̬����һ����Ӧ��script��ǩ
		req.createNode = function (config, moduleName, url) {
			var node = config.xhtml ?
					document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
					document.createElement('script');
			node.type = config.scriptType || 'text/javascript';
			node.charset = 'utf-8';
			node.async = true;
			return node;
		};
	
	3��������ʵ�֣�
		var require = function(){}
		require.config = function(){}
		require.define = function(){}
		
		require����ڣ�config��·��ӳ�䣬define���ģ��,
		Ȼ�󴴽�script��ǩ Ȼ������onload�¼�
	
	4���򵥵ļ�����
		define��require������һ��require������
===============================================================*/

(function(){


	//�洢�Ѿ����ص�ģ��
	var moduleCache = {};
	//����·����Ĭ��·�������е�ģ������￪ʼ�ң�
	var baseUrl = "";
	//·����ÿ�����ƶ�Ӧһ��·��
	var paths = {};
	
	var ostring = Object.prototype.toString;
	
	function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }
	
	function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }
	
	var require = function(name,deps,callback){
		var params = [];
		var depCount = 0;
		var i,isEmpty=false,moduleName;
		
		//������������
        if (isArray(name) && typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }else if(isFunction(name)){
			deps = [];
			callback = name;
			name = null;
		}
		
		
		
		//��ȡ��ǰ����ִ�е�js����Σ������onload�¼�֮ǰִ��
		//��������ڣ���Ĭ��ΪREQUIRE_MAIN
		moduleName = document.currentScript && document.currentScript.id || 'REQUIRE_MAIN';
	
		//��ʵ�֣�ֻ������������������Զ���ʱ����������
		if(deps.length){
			for(i = 0; i < deps.length; i++){
				
				//�Ե�i���������ü���
				//����
				(function(i){
					//����������1
					depCount++;
					
					//���ü��أ�
					//��ɼ��غ�����
					loadModule(deps[i],function(param){
										params[i] = param;
										depCount--;
										if(depCount === 0){
											saveModule(moduleName,params,callback);
										}
					});
				})(i);
			}
		}else{
			//û������
			isEmpty = true;
		}
		
		//���û������
		if(isEmpty){
			setTimeout(function(){
				saveModule(moduleName,null,callback);
			},0);
		}
	};  //end of require -:~
	
	//config��Ҫ�ǰ�һЩ���úõĶ����ŵ�������
	var config = function(obj){
		if(obj.hasOwnProperty('baseUrl'))
			baseUrl = obj.baseUrl;
		if(obj.hasOwnProperty('paths'))
			paths = obj.paths;
	};// end of config
	
	
	//��ȡjs�ļ���·��
	var getPath = function(moduleName){
		//��Ҫȥ��ַ�����ļ��м�����dep��Ӧ��·��
		var url = moduleName;
		
		if(paths.hasOwnProperty(moduleName))
			url = paths[moduleName];
		
		//·��ƴװ
		if(url.indexOf('.js') === -1) url = url+'.js';
		url = baseUrl === ""?baseUrl:(baseUrl+"/") + url;
		return url;
	};
	
	//����ģ��
	var loadModule = function(moduleName,callback){
		var url = getPath(moduleName),fs,module;
		
		//���ģ���Ѽ���
		if(moduleCache[moduleName]){
			module = moduleCache[moduleName];
			if(module.status === 'loaded'){
				setTimeout(callback(module.export),0);
			}else{
				//������ڼ�����״ֱ̬����onload���Բ���ֵ���ڼ��غú��������
				//ʵ�����������ǲ��Ǹ��� requirejs�õ�������
				module.onload.push(callback);
				//var modulescript = document.getElementById("moduleName");
				//modulescript.addEventListener("load",setTimeout(callback(module.export),0););
			}
		}else{
		
			/*
			���δ����
			status��Ϊ����״̬
			onload��ʵ�϶�Ӧrequirejs���¼��ص�����ģ�鱻���ö��ٴα仯ִ�ж��ٴλص���֪ͨ��������������
			*/
			module = moduleCache[moduleName] = {
				moduleName:moduleName,
				status:'loading',
				export:null,
				onload:[callback]
			};
			
			//����script��ǩ����
			_script = document.createElement('script');
			_script.id = moduleName;
			_script.type = 'text/javascript';
			_script.async = true;
			_script.src=url;
			
			fs = document.getElementsByTagName('script')[0];
			fs.parentNode.insertBefore(_script,fs);
		}
	};
	
	//����ģ��
	var saveModule = function(moduleName,params,callback){
		var module,func;
		
		if(moduleCache.hasOwnProperty(moduleName)){
			module = moduleCache[moduleName];
			module.status = 'loaded';
			
			//��apply��������ֹ�����������
			module.export = callback ? callback.apply(this,params) : null;
			
			//�������������shift()��������ĵ�һ��Ԫ��ɾ��,���ظ�Ԫ��
			//ʹ�ü������ã���ô������
			while(func = module.onload.shift()){
				func(module.export);
			}
			
		}else{
			callback && callback.apply(window,params);
		}
	};
	
	window.require = require;
	window.require.config = config;
	window.define = require;
	define.amd = {
        jQuery: true
    };
	
})();