import { CameraView, CameraType, CameraMode, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import SimpleExample from './TagScrollView';

export function CameraModule() {
    const tabBarHeight = useBottomTabBarHeight();
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const tagRef = useRef<SimpleExample>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [mode, setMode] = useState<CameraMode>("picture");
    const [facing, setFacing] = useState<CameraType>("back");
    const [recording, setRecording] = useState(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        if (photo) {
            const currentTag = tagRef.current?.state.selectedValue;
            setSelectedTag(currentTag || null);
            setUri(photo.uri);
            
            console.log({
                photoUri: photo.uri,
                tag: currentTag
            });
        }
    };

    const recordVideo = async () => {
        if (recording) {
            setRecording(false);
            ref.current?.stopRecording();
            return;
        }
        setRecording(true);
        const video = await ref.current?.recordAsync();
        console.log({ video });
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "picture" ? "video" : "picture"));
    };

    const toggleFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    const renderPicture = () => {
        return (
            <View>
                <Image
                    source={{ uri }}
                    contentFit="contain"
                    style={{ width: 300, aspectRatio: 1 }}
                />
                {selectedTag && (
                    <Text style={styles.tagText}>Tagged as: {selectedTag}</Text>
                )}
                <Button onPress={() => {
                    setUri(null);
                    setSelectedTag(null);
                }} title="Take another picture" />
            </View>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView
                style={styles.camera}
                ref={ref}
                mode={mode}
                facing={facing}
                mute={false}
                responsiveOrientationWhenOrientationLocked
            >
                <View style={styles.shutterContainer}>
                    <Pressable onPress={toggleMode}>
                        {mode === "picture" ? (
                            <AntDesign name="picture" size={32} color="white" />
                        ) : (
                            <Feather name="video" size={32} color="white" />
                        )}
                    </Pressable>
                    <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
                        {({ pressed }) => (
                            <View
                                style={[
                                    styles.shutterBtn,
                                    {
                                        opacity: pressed ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.shutterBtnInner,
                                        {
                                            backgroundColor: mode === "picture" ? "white" : "red",
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleFacing}>
                        <FontAwesome6 name="rotate-left" size={32} color="white" />
                    </Pressable>
                </View>
                
                <SimpleExample ref={tagRef} />
            </CameraView>
        );
    };

    return (
        <View style={[styles.container, { marginBottom: tabBarHeight }]}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
    },
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    tagText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});
