import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back'); /*ativa a camera traseira por padrão*/
  const [permission, requestPermission] = useCameraPermissions(); /*hook para lidar com permissões da câmera*/
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions(); /*hook para lidar com permissões da galeria*/
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Pede permissão da galeria ao abrir a tela
  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, []);

  if (!permission) return <View />;        /*Verifica se a permissão de galeria não foi concedida e solicita automaticamente ao abrir a tela. Se a permissão ainda não foi decidida, retorna uma tela vazia.*/

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para acessar a câmera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync(); /*Chama takePictureAsync() para capturar foto.*/
    if (result) setPhoto(result.uri);
  }

  // Simplificado — permissão já foi pedida no useEffect
  async function saveToGallery() {
    if (!photo) return;                   /*Assíncrona: interrompe se não há foto para salvar.*/

    try {
      await MediaLibrary.saveToLibraryAsync(photo);
      Alert.alert('Salvo!', 'Foto salva na galeria com sucesso. ✅');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    }
  }

  function toggleFacing() {
    setFacing(f => (f === 'back' ? 'front' : 'back'));
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewControls}>
          <TouchableOpacity onPress={() => setPhoto(null)} style={styles.button}>
            <Text style={styles.buttonText}>Descartar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveToGallery} style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>Salvar na galeria</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleFacing} style={styles.button}>
            <Text style={styles.buttonText}>Virar câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}>📷</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  previewControls: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
  },
  saveButton: { backgroundColor: '#2e86de' },
  captureButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 50,
  },
  buttonText: { color: 'white', fontSize: 16 },
  message: { textAlign: 'center', marginBottom: 16, fontSize: 16 },
  preview: { width: '100%', flex: 1 },
});