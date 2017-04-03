#include "../core/library.h"
#include "native.h"
#include "../core/plugin/pluginTexture.h"

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// テクスチャバインド状態の記録と重複確認
JNIEXPORT jboolean JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_corePluginTextureIsBind(JNIEnv *env, jobject obj, jint glId){
	return corePluginTextureIsBind(glId);
}

// ローカルテクスチャのコールバック
JNIEXPORT void JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_gamePluginTextureLocalCallbackCall(JNIEnv *env, jobject obj, jint callbackId, jint glId, jint w, jint h){
	gamePluginTextureLocalCallbackCall(callbackId, glId, w, h);
}

// フォントテクスチャのコールバック
JNIEXPORT void JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_gamePluginTextureFontCallbackCall(JNIEnv *env, jobject obj, jint callbackId, jint glId, jint w, jint h, jint codeListIndex){
	gamePluginTextureFontCallbackCall(callbackId, glId, w, h, codeListIndex);
}

// フォントテクスチャ用文字リスト作成
JNIEXPORT jint JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_gamePluginTextureFontCodeListCreate(JNIEnv *env, jobject obj, jint letterLength){
	return gamePluginTextureFontCodeListCreate(letterLength);
}

// フォントテクスチャ用文字リストの要素設定
JNIEXPORT void JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_gamePluginTextureFontCodeListSet(JNIEnv *env, jobject obj, jint codeListIndex, jint index, jint code, jint x, jint y, jint w, jint h){
	gamePluginTextureFontCodeListSet(codeListIndex, index, code, x, y, w, h);
}

// フォントテクスチャ用文字リスト破棄
JNIEXPORT void JNICALL Java_com_totetero_fuhaha_AndroidPluginTexture_gamePluginTextureFontCodeListDispose(JNIEnv *env, jobject obj, jint codeListIndex){
	gamePluginTextureFontCodeListDispose(codeListIndex);
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ローカルデータ読み込み glIdの解放はゲーム側で管理する
void platformPluginTextureLocal(void *param, char *src, void(*callback)(void *param, PLUGINTEXTURE_LOCAL_CALLBACKPARAMS)){
	JNIEnv *env = getJNIEnv();
	jclass cls = (*env)->FindClass(env, "com/totetero/fuhaha/AndroidPluginTexture");
	jmethodID mid = (*env)->GetStaticMethodID(env, cls, "platformPluginTextureLocal", "(ILjava/lang/String;)V");
	jstring str = (*env)->NewStringUTF(env, src);
	(*env)->CallStaticVoidMethod(env, cls, mid, gamePluginTextureLocalCallbackSet(param, callback), str);
}

// フォントテクスチャ作成 glIdとコールバックバッファの解放はプラットフォーム側で管理する
void platformPluginTextureFont(void *param, int fontSetId, char *letterList, int letterLenght, void(*callback)(void *param, PLUGINTEXTURE_FONT_CALLBACKPARAMS)){
	JNIEnv *env = getJNIEnv();
	jclass cls = (*env)->FindClass(env, "com/totetero/fuhaha/AndroidPluginTexture");
	jmethodID mid = (*env)->GetStaticMethodID(env, cls, "platformPluginTextureFont", "(IILjava/lang/String;I)V");
	jstring str = (*env)->NewStringUTF(env, letterList);
	(*env)->CallStaticVoidMethod(env, cls, mid, gamePluginTextureFontCallbackSet(param, callback), fontSetId, str, letterLenght);
}

// フォントテクスチャ破棄
void platformPluginTextureFontDispose(int codeListIndex){
	JNIEnv *env = getJNIEnv();
	jclass cls = (*env)->FindClass(env, "com/totetero/fuhaha/AndroidPluginTexture");
	jmethodID mid = (*env)->GetStaticMethodID(env, cls, "platformPluginTextureFontDispose", "(I)V");
	(*env)->CallStaticVoidMethod(env, cls, mid, codeListIndex);
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

