import { Stack } from "expo-router";

export default function Layout() { // Este componente é o layout raiz para todas as telas dentro da pasta "app". Ele define a estrutura de navegação usando o Stack Navigator do Expo Router. O header é ocultado para todas as telas, mas isso pode ser personalizado para cada tela individualmente, se necessário.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}