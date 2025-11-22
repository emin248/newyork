import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useRef, useEffect, useState } from 'react';

export default function App() {
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);

    // Android geri düyməsini idarə etmək üçün
    useEffect(() => {
        if (Platform.OS === 'android') {
            const onBackPress = () => {
                if (canGoBack && webViewRef.current) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
    }, [canGoBack]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://www.baki-sumqayit.site/' }}
                style={styles.webview}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    webview: {
        flex: 1,
    },
});
