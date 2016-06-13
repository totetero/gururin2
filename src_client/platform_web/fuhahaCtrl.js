
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
"use strict";

mergeInto(LibraryManager.library, {
	// ----------------------------------------------------------------

	// ゲーム初期化完了後のプラットフォーム初期化
	webFuhahaCtrlInit: function(){
		// ----------------------------------------------------------------
		// タッチ入力イベント処理初期化

		var ua = window.navigator.userAgent;
		var isIos = false;
		if(ua.indexOf('iPhone') > 0){isIos = true;}
		if(ua.indexOf('iPad') > 0){isIos = true;}
		if(ua.indexOf('iPod') > 0){isIos = true;}

		var isTouch = ('ontouchstart' in window);
		// タッチ1状態
		var t1x = 0;
		var t1y = 0;
		var t1dn = false;
		var t1id = -1;
		var t1trigger = false;
		// タッチ2状態
		var t2x = 0;
		var t2y = 0;
		var t2dn = false;
		var t2id = -1;
		var t2trigger = false;

		function onTouch(){
			if(t1trigger){ccall("gameEvenTouch", "null", ["null", "null", "null", "null"], [0, t1x, t1y, t1dn])};
			if(t2trigger){ccall("gameEvenTouch", "null", ["null", "null", "null", "null"], [1, t2x, t2y, t2dn])};
			t1trigger = false;
			t2trigger = false;
		}

		// タッチ開始関数
		function tdnfn(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var rect = Module.canvas.getBoundingClientRect();
			if(isTouch){
				for(var i = 0; i < e.changedTouches.length; i++){
					var tinfo = e.changedTouches[i];
					if(t1id < 0 && t1id != tinfo.identifier && t2id != tinfo.identifier){
						t1id = tinfo.identifier;
						t1x = tinfo.clientX - rect.left;
						t1y = tinfo.clientY - rect.top;
						t1dn = true;
						t1trigger = true;
					}
					if(t2id < 0 && t1id != tinfo.identifier && t2id != tinfo.identifier){
						t2id = tinfo.identifier;
						t2x = tinfo.clientX - rect.left;
						t2y = tinfo.clientY - rect.top;
						t2dn = true;
						t2trigger = false;
					}
				}
			}else{
				t1x = e.clientX - rect.left;
				t1y = e.clientY - rect.top;
				t1dn = true;
				t1trigger = true;
			}
			onTouch();
			e.preventDefault();
			e.stopPropagation();

			// タッチしないと音を再生開始しない端末のための無音再生
			if(globalWebPluginSound && globalWebPluginSound.soundTouch){globalWebPluginSound.soundTouch();}
		}

		// タッチ移動関数
		function tmvfn(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var rect = Module.canvas.getBoundingClientRect();
			if(isTouch){
				for(var i = 0; i < e.changedTouches.length; i++){
					var tinfo = e.changedTouches[i];
					if(t1id == tinfo.identifier){
						t1x = tinfo.clientX - rect.left;
						t1y = tinfo.clientY - rect.top;
						t1trigger = true;
					}
					if(t2id == tinfo.identifier){
						t2x = tinfo.clientX - rect.left;
						t2y = tinfo.clientY - rect.top;
						t2trigger = true;
					}
				}
			}else{
				t1x = e.clientX - rect.left;
				t1y = e.clientY - rect.top;
				t1trigger = true;
			}
			onTouch();
			e.preventDefault();
			e.stopPropagation();
		}

		// タッチ完了関数
		function tupfn(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var rect = Module.canvas.getBoundingClientRect();
			if(isTouch){
				for(var i = 0; i < e.changedTouches.length; i++){
					var tinfo = e.changedTouches[i];
					if(t1id == tinfo.identifier){
						t1id = -1;
						t1x = tinfo.clientX - rect.left;
						t1y = tinfo.clientY - rect.top;
						t1dn = false;
						t1trigger = true;
					}
					if(t2id == tinfo.identifier){
						t2id = -1;
						t2x = tinfo.clientX - rect.left;
						t2y = tinfo.clientY - rect.top;
						t2dn = false;
						t2trigger = true;
					}
				}
			}else{
				t1x = e.clientX - rect.left;
				t1y = e.clientY - rect.top;
				t1dn = false;
				t1trigger = true;
			}
			onTouch();
			e.preventDefault();
			e.stopPropagation();
		}

		// タッチイベント設定
		if(isTouch){
			Module.canvas.addEventListener("touchstart", tdnfn);
			Module.canvas.addEventListener("touchmove", tmvfn);
			Module.canvas.addEventListener("touchend", tupfn);
			Module.canvas.addEventListener("touchcancel", tupfn);
		}else{
			Module.canvas.addEventListener("mousedown", tdnfn);
			Module.canvas.addEventListener("mousemove", tmvfn);
			Module.canvas.addEventListener("mouseup", tupfn);
			Module.canvas.addEventListener("mouseout", function(e){
				var x = e.clientX;
				var y = e.clientY;
				var w = window.innerWidth;
				var h = window.innerHeight;
				if(x <= 0 || w <= x || y <= 0 || h <= y){tupfn(e);}
			});
		}
		document.oncontextmenu = function(){return false;}

		// ----------------------------------------------------------------
		// キー入力イベント処理初期化

		// キー押下状態
		var kbk = false;
		var kup = false;
		var kdn = false;
		var krt = false;
		var klt = false;
		var kzb = false;
		var kxb = false;
		var kcb = false;
		var kvb = false;

		function onKeyBack(){ccall("gameEventKeyBack", "null", ["null"], [kbk]);}
		function onKeyArrow(){ccall("gameEventKeyArrow", "null", ["null", "null", "null", "null"], [kup, kdn, krt, klt]);}
		function onKeyZxcv(){ccall("gameEventKeyZxcv", "null", ["null", "null", "null", "null"], [kzb, kxb, kcb, kvb]);}

		// キーを押し込む
		document.addEventListener("keydown", function(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var isChangeKeyArrow = false;
			var isChangeKeyZxcv = false;
			switch(e.keyCode){
				case 37: klt = true; isChangeKeyArrow = true; break;
				case 38: kup = true; isChangeKeyArrow = true; break;
				case 39: krt = true; isChangeKeyArrow = true; break;
				case 40: kdn = true; isChangeKeyArrow = true; break;
				case 90: kzb = true; isChangeKeyZxcv = true; break;
				case 88: kxb = true; isChangeKeyZxcv = true; break;
				case 67: kcb = true; isChangeKeyZxcv = true; break;
				case 86: kvb = true; isChangeKeyZxcv = true; break;
			}
			if(isChangeKeyArrow){onKeyArrow();}
			if(isChangeKeyZxcv){onKeyZxcv();}
			// キーイベント終了
			e.preventDefault();
			e.stopPropagation();
		});

		// キーを離す
		document.addEventListener("keyup", function(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var isChangeKeyArrow = false;
			var isChangeKeyZxcv = false;
			switch(e.keyCode){
				case 37: klt = false; isChangeKeyArrow = true; break;
				case 38: kup = false; isChangeKeyArrow = true; break;
				case 39: krt = false; isChangeKeyArrow = true; break;
				case 40: kdn = false; isChangeKeyArrow = true; break;
				case 90: kzb = false; isChangeKeyZxcv = true; break;
				case 88: kxb = false; isChangeKeyZxcv = true; break;
				case 67: kcb = false; isChangeKeyZxcv = true; break;
				case 86: kvb = false; isChangeKeyZxcv = true; break;
			}
			if(isChangeKeyArrow){onKeyArrow();}
			if(isChangeKeyZxcv){onKeyZxcv();}
			// キーイベント終了
			e.preventDefault();
			e.stopPropagation();
		});

		// 戻るためのハッシュタグ監視
		(function hashObservation(){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var currHash = window.parent.location.hash;
			var firstHash = "#h0";
			var secondHash = "#h1";
			if(currHash == secondHash){
			}else if(currHash == firstHash){
				window.parent.location.hash = secondHash;
				kbk = true; onKeyBack();
				kbk = false; onKeyBack();
			}else{
				window.parent.location.hash = firstHash;
			}
			setTimeout(hashObservation, 100);
		})();

		// ----------------------------------------------------------------
		// 加速度イベント

		window.addEventListener("devicemotion", function(e){
			if(globalWebFuhahaSurface && globalWebFuhahaSurface.isExit){return;}
			var accx = e.accelerationIncludingGravity.x;
			var accy = e.accelerationIncludingGravity.y;
			var accz = e.accelerationIncludingGravity.z;
			if(isIos){accx *= -1; accy *= -1; accz *= -1;}
			ccall("gameEventAcceleration", "null", ["null", "null", "null"], [accx, accy, accz]);
		});

		// ----------------------------------------------------------------
	},

	// ----------------------------------------------------------------
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

