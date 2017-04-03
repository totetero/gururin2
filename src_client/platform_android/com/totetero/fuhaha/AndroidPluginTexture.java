package com.totetero.fuhaha;

import java.io.InputStream;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.GLES20;
import android.opengl.GLUtils;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// プラグインクラス
public class AndroidPluginTexture{
	// ----------------------------------------------------------------

	// JNI連携
	static{System.loadLibrary("fuhaha_native");}
	public static native boolean corePluginTextureIsBind(int glId);
	public static native void gamePluginTextureLocalCallbackCall(int callbackId, int glId, int w, int h);
	public static native void gamePluginTextureFontCallbackCall(int callbackId, int glId, int w, int h, int codeListIndex);
	public static native int gamePluginTextureFontCodeListCreate(int letterLength);
	public static native void gamePluginTextureFontCodeListSet(int codeListIndex, int index, int code, int x, int y, int w, int h);
	public static native void gamePluginTextureFontCodeListDispose(int codeListIndex);

	// ----------------------------------------------------------------

	// ローカルデータ読み込み
	public static void platformPluginTextureLocal(int callbackId, final String src){
		final CallbackBitmap callback = new CallbackBitmap(callbackId);
		new Thread(new Runnable(){public void run(){
			Bitmap bmp = null;
			try{
				InputStream stream = FuhahaGLView.activity.getResources().getAssets().open(src);
				bmp = BitmapFactory.decodeStream(stream);
				stream.close();
			}catch(Exception e){e.printStackTrace();}
			FuhahaGLView.surfaceView.queueEvent(callback.setBitmap(bmp));
		}}).start();
	}

	// メインスレッドでビットマップテクスチャ作成クラス
	private static class CallbackBitmap implements Runnable{
		private int callbackId;
		private Bitmap bmp;
		public CallbackBitmap(int callbackId){
			AndroidPluginUtil.nativePluginUtilLoadingIncrement();
			this.callbackId = callbackId;
		}
		public CallbackBitmap setBitmap(Bitmap bmp){this.bmp = bmp; return this;}
		public void run(){
			int glId = 0;
			int width = 0;
			int height = 0;
			if(this.bmp != null){
				int[] glIds = new int[1];
				GLES20.glGenTextures(1, glIds, 0);
				glId = glIds[0];
				width = this.bmp.getWidth();
				height = this.bmp.getHeight();

				AndroidPluginTexture.corePluginTextureIsBind(glId);
				GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, glId);
				GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, this.bmp, 0);
				GLES20.glGenerateMipmap(GLES20.GL_TEXTURE_2D);
				this.bmp.recycle();

				// nexus6で中断復帰直後にmipmapの生成がうまくいっていないっぽいので一呼吸おいて再生成してみる
				final int inner_glId = glId;
				(new Thread(new Runnable(){public void run(){
					try{Thread.sleep(100);}catch(Exception e){}
					FuhahaGLView.surfaceView.queueEvent(new Runnable(){public void run(){
						AndroidPluginTexture.corePluginTextureIsBind(inner_glId);
						GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, inner_glId);
						GLES20.glGenerateMipmap(GLES20.GL_TEXTURE_2D);
					}});
				}})).start();
			}
			AndroidPluginUtil.nativePluginUtilLoadingDecrement();
			AndroidPluginTexture.gamePluginTextureLocalCallbackCall(this.callbackId, glId, width, height);
		}
	}

	// ----------------------------------------------------------------

	// フォントテクスチャ作成
	public static void platformPluginTextureFont(int callbackId, int fontSetId, String letterList, int letterLenght){
	}

	// フォントテクスチャ破棄
	public static void platformPluginTextureFontDispose(int codeListIndex){
	}

	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

