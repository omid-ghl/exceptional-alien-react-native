import React, { useCallback, useMemo } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	FlatList,
	Linking,
	ListRenderItem,
} from "react-native";

import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "@/Navigators/Stacks";
import { colors, SVG, typography } from "@/Theme";
import { useTranslation } from "react-i18next";
import {
	CONTRIBUTOR_EMAIL_ADDRESS,
	FACEBOOK_SOCIAL_URL,
	GENERAL_EMAIL_ADDRESS,
	INSTAGRAM_SOCIAL_URL,
	LINKEDIN_SOCIAL_URL,
	TIKTOK_SOCIAL_URL,
} from "@/constants/common";

interface Contact {
	title: string;
	onPress: () => void;
}

const keyExtractor = (item: Contact) => item.title;

const ARROW_RIGHT_SIZE = 15;

const Contact: React.FC<StackScreenProps<StackParamList, "contact">> = () => {
	const { t } = useTranslation();

	const socialData: Contact[] = [
		{
			title: t("instagram"),
			onPress: () => handleOpenUrl(INSTAGRAM_SOCIAL_URL),
		},
		{
			title: t("tiktok"),
			onPress: () => handleOpenUrl(TIKTOK_SOCIAL_URL),
		},
		{
			title: t("facebook"),
			onPress: () => handleOpenUrl(FACEBOOK_SOCIAL_URL),
		},
		{
			title: t("linkedin"),
			onPress: () => handleOpenUrl(LINKEDIN_SOCIAL_URL),
		},
	];

	const renderItem: ListRenderItem<Contact> = ({ item }) => {
		return (
			<TouchableOpacity onPress={item?.onPress} style={styles.settingDetail}>
				<View style={styles.detailTxtContainer}>
					<Text style={styles.detailTxt}>{item.title}</Text>
				</View>
				<SVG.ChevronRight width={ARROW_RIGHT_SIZE} height={ARROW_RIGHT_SIZE} stroke={colors.black} />
			</TouchableOpacity>
		);
	};

	const openEmail = useCallback(async (email: string) => {
		const url = `mailto:${email}`;
		if (await Linking.canOpenURL(url)) {
			Linking.openURL(url);
		}
	}, []);

	const handleOpenUrl = (url: string) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) Linking.openURL(url);
		});
	};

	const renderHeader = useMemo(() => {
		return (
			<>
				<Text style={styles.settingTitle}>{t("contact_us")}</Text>
				<>
					<Text style={styles.wrapperTitle}>{t("get_touch")}</Text>
					<TouchableOpacity
						style={styles.contactBtn}
						onPress={() => openEmail(GENERAL_EMAIL_ADDRESS)}>
						<View>
							<Text style={styles.wrapperDesc}>{t("touch_desc")}</Text>
							<Text style={styles.wrapperLink}>{t("alien_mail")}</Text>
						</View>
						<SVG.ChevronRight width={ARROW_RIGHT_SIZE} height={ARROW_RIGHT_SIZE} stroke={colors.black} />
					</TouchableOpacity>
				</>
				<View style={styles.contributorWrapper}>
					<Text style={styles.contributorTitle}>{t("be_contributor")}</Text>
					<TouchableOpacity
						style={styles.contactBtn}
						onPress={() => openEmail(CONTRIBUTOR_EMAIL_ADDRESS)}>
						<View>
							<Text style={styles.wrapperDesc}>
								{t("contributor_enquiries")}
							</Text>
							<Text style={styles.wrapperLink}>{t("contributor_mail")}</Text>
						</View>
						<SVG.ChevronRight width={ARROW_RIGHT_SIZE} height={ARROW_RIGHT_SIZE} stroke={colors.black} />
					</TouchableOpacity>
				</View>
				<Text style={styles.socialTitle}>{t("follow_us")}</Text>
			</>
		);
	}, []);

	return (
		<View style={styles.container}>
			<FlatList data={socialData} renderItem={renderItem} keyExtractor={keyExtractor}
			          showsVerticalScrollIndicator={false}
			          ListHeaderComponent={renderHeader} />
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
	wrapperTitle: {
		...typography.h3,
		marginBottom: 24,
	},
	wrapperDesc: {
		...typography.h5,
		color: colors.gray100,
	},
	wrapperLink: {
		...typography.h5,
		textDecorationColor: colors.primary,
		textDecorationStyle: "solid",
		textDecorationLine: "underline",
		color: colors.primary,
	},
	contactBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	contributorWrapper: {
		marginTop: 40,
	},
	socialTitle: {
		...typography.h3,
		marginVertical: 24,
	},
	contributorTitle: {
		...typography.h3,
		marginBottom: 20,
	},
});

export default Contact;
