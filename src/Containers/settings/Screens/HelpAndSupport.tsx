import React, { useMemo } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	FlatList, ListRenderItem,
} from "react-native";

import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "@/Navigators/Stacks";
import { colors, SVG, typography } from "@/Theme";
import { useTranslation } from "react-i18next";

interface HelpAndSupport {
	title: string;
	onPress: () => void;
}

const keyExtractor = (item: HelpAndSupport) => item.title;

const HelpAndSupport: React.FC<StackScreenProps<StackParamList, "helpAndSupport">> = ({ navigation }) => {
	const { t } = useTranslation();

	const HELP_SUPPORT: HelpAndSupport[] = [
		{
			title: t("contact_us"),
			onPress: () => navigation.navigate("contact"),
		},
		// {
		//   title: t('send_feedback'),
		//   onPress: () => navigation.navigate("sendFeedback")
		// },
		// {
		//   title: t('faq'),
		//   onPress: () => navigation.navigate("faq")
		// },
	];

	const renderItem: ListRenderItem<HelpAndSupport> = ({ item }) => {
		return (
			<TouchableOpacity onPress={item.onPress} style={styles.settingDetail}>
				<View style={styles.detailTxtContainer}>
					<Text style={styles.detailTxt}>{item.title}</Text>
				</View>
				<SVG.ChevronRight width={15} height={15} stroke={colors.black} />
			</TouchableOpacity>
		);
	};

	const renderHeader = useMemo(() => <Text style={styles.settingTitle}>{t("help_support")}</Text>, []);

	return (
		<View style={styles.container}>
			<FlatList data={HELP_SUPPORT} renderItem={renderItem} keyExtractor={keyExtractor}
			          showsVerticalScrollIndicator={false} ListHeaderComponent={renderHeader} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: 16,
	},
	settingDetail: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
		alignItems: "center",
	},
	detailTxt: {
		...typography.h5,
		color: colors.gray100,
	},
	detailTxtContainer: { flexDirection: "row", alignItems: "center" },
	settingTitle: {
		...typography.h1,
		marginTop: 10,
		marginBottom: 30,
	},
});

export default HelpAndSupport;
