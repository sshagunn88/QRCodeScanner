import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const QRScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanReady, setScanReady] = useState(true);

  if (!permission) return <View />;

  const startScanner = async () => {
    if (!permission.granted) {
      const res = await requestPermission();
      if (res.granted) {
        setShowScanner(true);
      } else {
        Alert.alert("Camera permission is required.");
      }
    } else {
      setShowScanner(true);
    }
  };

  const handleScan = ({ data }) => {
    if (scanned || !scanReady) return;

    setScanReady(false);
    setTimeout(() => {
      setScanned(true);
      setScannedData(data);
      console.log("Scanned QR Code:", data);
    }, 1500); // 1.5 sec delay
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
    setScanReady(true);
  };

  const flipCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!showScanner) {
    return (
      <View style={styles.centered}>
        <Text style={styles.welcomeText}>Welcome to QRScanner!</Text>
        <TouchableOpacity onPress={startScanner} style={styles.darkButton}>
          <Text style={styles.darkButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={handleScan}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          >
            <View style={styles.overlay}>
              {/* Removed Align Text Here */}
              <View style={styles.scanArea} />
            </View>
          </CameraView>

          <TouchableOpacity onPress={flipCamera} style={styles.darkButton}>
            <Text style={styles.darkButtonText}>Flip Camera</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Scanned Result:</Text>
          <Text style={styles.resultText}>{scannedData}</Text>

          <TouchableOpacity onPress={resetScanner} style={styles.darkButton}>
            <Text style={styles.darkButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#999", // grey border
    borderRadius: 12,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  darkButton: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  darkButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default QRScanner;
