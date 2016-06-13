#import "fuhaha-Swift.h"
#include "library.h"
#include "platform.h"
#include "native.h"
#include "pluginData.h"

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// HTTP通信 コールバックバッファは要解放
void platformPluginDataHttp(void *param, char *url, char *request, void(*callback)(void *param, void *buff, size_t size)){
	pluginDataCallbackId callbackId = gamePluginDataCallbackSet(param, callback);
	NSString *nsstr1 = [NSString stringWithCString: url encoding: NSUTF8StringEncoding];
	NSString *nsstr2 = [NSString stringWithCString: request encoding: NSUTF8StringEncoding];
	[IosPluginData platformPluginDataHttp: callbackId url: nsstr1 request: nsstr2];
}

// ----------------------------------------------------------------

// ローカルデータ読み込み コールバックバッファは要解放
void platformPluginDataLocal(void *param, char *src, void(*callback)(void *param, void *buff, size_t size)){
	pluginDataCallbackId callbackId = gamePluginDataCallbackSet(param, callback);
	NSString *nsstr1 = [NSString stringWithCString: src encoding: NSUTF8StringEncoding];
	[IosPluginData platformPluginDataLocal: callbackId src: nsstr1];
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

