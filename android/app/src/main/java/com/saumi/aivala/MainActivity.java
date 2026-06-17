package com.saumi.aivala;

import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // Reset all aggressive transparency - we are going back to basics
        if (bridge != null) {
            WebView webView = bridge.getWebView();
            webView.setBackgroundColor(Color.WHITE);
        }
        getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.BLACK));
    }

}