import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
    return (
        <div>
            <Stack.Screen options={{title: "Not Found"}} />
            <View>
            <Link href={"/"}>
            Go back to Home
            </Link>
            </View>
        </div>
    );
}