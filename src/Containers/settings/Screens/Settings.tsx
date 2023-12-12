import React, { useCallback, useMemo, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	FlatList, ListRenderItem, Pressable,
} from "react-native";

import { Button } from "@/Commons";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "@/Navigators/Stacks";
import { colors, SVG, typography } from "@/Theme";
import { useAppDispatch, useAppSelector } from "@/Hooks";
import { reset as resetAuthStore } from "@/Store/auth";
import { reset as resetDiscoverStore } from "@/Store/discover";
import { reset as resetNavigationStore } from "@/Store/navigation";
import { reset as resetOnboardingStore } from "@/Store/onboarding";
import { reset as resetUserDetailsStore } from "@/Store/userDetails";
import { api, TokenStorage } from "@/Services";
import { useTranslation } from "react-i18next";
import { navigate } from "@/Navigators";

interface SettingItem {
	title: string,
	onPress: () => void,
	needVerify?: boolean
}

interface Settings {
	title: string,
	guestMode?: boolean,
	items: SettingItem []
}

const keyExtractor = (item: Settings) => item.title;

const Settings: React.FC<StackScreenProps<StackParamList, "settings">> = ({
	                                                                          navigation,
                                                                          }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();
	const user = useAppSelector(state => state.auth.user);
	const dispatch = useAppDispatch();
	const guestMode = useAppSelector(state => state.auth.guest.guestMode);

	const SETTINGS: Settings[] = [
		{
			title: t("account"),
			guestMode,
			items: [
				{
					title: t("personal_details"),
					onPress: () => navigation.navigate("personalDetail"),
				},
				{
					title: t("change_email"),
					onPress: () => navigation.navigate("changeEmail"),
					needVerify: !user?.email_verified_at,
				},
				{
					title: t("reset_password"),
					onPress: () => navigation.navigate("resetPassword"),
				},

			],
		},
		{
			title: t("preferences"),
			guestMode,
			items: [
				{
					title: t("place_preferences"),
					onPress: () => navigation.navigate("placeInterests"),
				},
				{
					title: t("creative_field"),
					onPress: () => navigation.navigate("fieldInterests"),
				},
			],
		},
		{
			title: t("community"),
			items: [
				{
					title: t("nominate_Gem"),
					onPress: () => navigation.navigate("nominate"),
				},
			],
		},
		{
			title: t("contact_us"),
			items: [
				{
					title: t("help_support"),
					onPress: () => navigation.navigate("helpAndSupport"),
				},
			],
		},
		{
			title: t("about"),
			items: [
				{
					title: t("terms_privacy"),
					onPress: () => navigation.navigate("about"),
				},
			],
		},
	];

	const logout = useCallback(async () => {
		setIsLoading(true);
		await TokenStorage.removeToken();
		dispatch(resetAuthStore());
		dispatch(resetDiscoverStore());
		dispatch(resetNavigationStore());
		dispatch(resetOnboardingStore());
		dispatch(resetUserDetailsStore());
		dispatch(api.util.resetApiState());
		setIsLoading(false);
		navigation.reset({
			routes: [{ name: "splash" }],
		});
	}, [dispatch, navigation]);

	const login = () => navigate("auth");

	const deleteAccount = () => navigation.navigate("deleteAccount");

	const renderItem: ListRenderItem<Settings> = ({ item }) => {
		if (item.guestMode) return null;
		return (
			<>
				<Text style={styles.settingTitle}>{item.title}</Text>
				{item.items.map((item, index) => {
					return (
						<TouchableOpacity key={index} onPress={item.onPress}
						                  style={styles.settingDetail}>
							<View style={styles.detailTxtContainer}>
								<Text style={styles.detailTxt}>{item.title}</Text>
								{!!item.needVerify && (
									<View style={styles.verifyConditionStyle}>
										<Text style={styles.verifyTxt}>{t("not_verified")}</Text>
									</View>
								)}
							</View>
							<SVG.ChevronRight width={15} height={15} stroke={colors.black} />
						</TouchableOpacity>
					);
				})}
			</>
		);
	};

	const renderHeader = useMemo(() => {
		return (
			<Text style={styles.headerTitle}>{t("settings")}</Text>
		);
	}, []);

	const textButton = useMemo(() => {
		if (guestMode) return t("log_in");
		return t("log_out");
	}, [guestMode]);

	const renderFooter = useMemo(() => {
		return (
			<>
				<Button
					style={styles.logoutBtn}
					onPress={guestMode ? login : logout}
					title={textButton}
					disable={isLoading}
					isLoading={isLoading}
				/>
				{!guestMode && (
					<Pressable
						hitSlop={15}
						onPress={deleteAccount}
						style={styles.deleteBtn}>
						<Text style={styles.deleteBtnTxt}>{t("delete_account")}</Text>
					</Pressable>
				)}
			</>
		);
	}, [guestMode, textButton, isLoading]);

	const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

	return (
		<View style={styles.container}>
			<FlatList data={SETTINGS} renderItem={renderItem} keyExtractor={keyExtractor}
			          ListHeaderComponent={renderHeader}
			          showsVerticalScrollIndicator={false}
			          ItemSeparatorComponent={renderSeparator}
			          ListFooterComponent={renderFooter} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: 16,
	},
	headerTitle: {
		...typography.h1,
		marginTop: 10,
		marginBottom: 30,
		color: colors.black,
	},
	settingItem: {
		marginBottom: 16,
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
		...typography.h3,
		marginBottom: 12,
	},
	logoutBtn: {
		marginVertical: 20,
	},
	deleteBtn: {
		alignItems: "center",
		paddingBottom: 2,
		marginBottom: 24,
	},
	deleteBtnTxt: {
		...typography.linkSecondary,
	},
	verifyTxt: {
		...typography.caption,
		alignSelf: "center",
		marginLeft: 5,
	},
	verifyConditionStyle: {
		backgroundColor: colors.gray10,
		marginLeft: 7,
		borderRadius: 10,
		paddingVertical: 6,
		paddingRight: 4,
	},
	listStyle: { marginTop: 24 },
	separator: {
		marginBottom: 12,
	},
});

export default Settings;
