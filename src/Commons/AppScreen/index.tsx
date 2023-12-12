import { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/Theme/Colors";
import { StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { colors } from "@/Theme";

interface Props {
	children: React.ReactNode;
}

export const AppScreen: FC<Props> = ({ children }) => {
	const { top: statusBarHeight } = useSafeAreaInsets();

	const statusBarStyle = {
		height: statusBarHeight,
		backgroundColor: Colors.white,
	} as ViewStyle;

	return (
		<View style={styles.container}>
			<View style={statusBarStyle} />
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
});
