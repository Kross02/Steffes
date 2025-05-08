import { CameraView, CameraType, CameraMode, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import SimpleExample from './TagScrollView';

interface CameraModuleProps {
  onPhotoTaken?: (photoData: { uri: string; tag: string | null }) => void;
}

export function CameraModule({ onPhotoTaken }: CameraModuleProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const tagRef = useRef<SimpleExample>(null);
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
            if (onPhotoTaken) {
                onPhotoTaken({
                    uri: photo.uri,
                    tag: currentTag || null
                });
            }
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

    return (
        <View style={styles.container}>
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
        bottom: 100,
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
    }
});
