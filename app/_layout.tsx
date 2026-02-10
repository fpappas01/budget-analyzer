import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import Db from "./database/db";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="budget.db"
      // assetSource={{ assetId: require('../assets/budget.db') }}
      // useSuspense={true}
      options={{ useNewConnection: false }}
    >
      <Db />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
