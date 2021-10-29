import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { postAction } from "./Actions";
import { useTheme } from "react-native-paper";
import { BsImages } from "react-icons/bs";
export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const camera = useRef();
  const { colors } = useTheme();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const takePicture = async () => {
    const photo = await camera.current.takePictureAsync({ base64: false });
    MediaLibrary.saveToLibraryAsync(photo.uri);
    setImage(photo.uri);
    setCameraVisible(false);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const sendImage = async () => {
    const formData = new FormData();
    if (image === null) {
      Alert.alert("Lütfen Bir Görsel Yükleyiniz !");
    } else {
      formData.append("file", image);

      postAction(formData);
    }
  };
  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false || hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: colors.primary, fontSize: 26 }}>
          Kamera İzni Verilmediği İçin Kamera Kullanılamıyor
        </Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.emptyImage, { borderColor: colors.primary }]}>
          <Text style={{ color: colors.primary }}>Görsel Yükleyin</Text>
        </View>
      )}
      {cameraVisible && (
        <Camera ref={camera} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.text}> Kamerayı Çevir </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                takePicture();
              }}
            >
              <Text style={styles.text}>Çek</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      {image && (
        <Text
          onPress={() => setImage(null)}
          style={{
            fontSize: 26,
            color: "white",
            position: "absolute",
            top: 50,
            right: 20,
          }}
        >
          X
        </Text>
      )}
      <TouchableOpacity
        style={[styles.buttons, { backgroundColor: colors.primary }]}
        onPress={pickImage}
      >
        <Text
          style={{ color: colors.surface, fontSize: 16, fontWeight: "600" }}
        >
          Galeriden Seç
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttons, { backgroundColor: colors.primary }]}
        onPress={() => setCameraVisible((prevState) => !prevState)}
      >
        <Text
          style={{ color: colors.surface, fontSize: 16, fontWeight: "600" }}
        >
          Kamerayı Aç
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttons, { backgroundColor: colors.primary }]}
        onPress={() => sendImage()}
      >
        <Text
          style={{ color: colors.surface, fontSize: 16, fontWeight: "600" }}
        >
          Görseli Gönder
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttons, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("List")}
      >
        <Text
          style={{ color: colors.surface, fontSize: 16, fontWeight: "600" }}
        >
          Kişi Listesine Git
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  camera: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    zIndex: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",

    position: "absolute",
    bottom: 40,
    justifyContent: "space-between",
  },

  text: {
    fontSize: 18,
    color: "white",
  },
  buttons: {
    width: 350,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  emptyImage: {
    borderWidth: 1,
    width: "90%",
    height: 350,
    borderRadius: 10,
    marginBottom: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: 400,
    height: 400,
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 50,
  },
});
