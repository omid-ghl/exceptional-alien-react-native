import React, { useMemo } from "react";
import {
	Alert,
	FlatList,
	ListRenderItem,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { IStoryContent } from "./StoryContent";
import { typography, variables } from "@/Theme";
import { ContentBlocks } from "@/Models";
import StoryContentRenderer from "@/Commons/StoryContentRenderer";
import { useGemByIdQuery } from "@/Services";
import { GemCard } from "@/Commons";
import { navigate } from "@/Navigators";
import { useTranslation } from "react-i18next";
import { usePlaybookByIdQuery } from "@/Services/modules/playbooks";

const StoryContent = (props: IStoryContent.IProps) => {
	const { contentBlocks, playbookId } = props;
	const { t } = useTranslation();

	const { data: playbookData, isSuccess: playbookIsSuccess } =
		usePlaybookByIdQuery(playbookId);

	const gemsArray: number[] = useMemo(() => {
		return contentBlocks
			.filter(
				x =>
					x?.layout === "gem" &&
					x?.attributes?.id &&
					typeof x.attributes.id === "string" &&
					!isNaN(parseInt(x.attributes.id, 10)),
			)
			.map(x => parseInt(x.attributes!.id!, 10));
	}, [contentBlocks]);

	const GemRender = ({ id }: { id: number }) => {
		const { data: gemData, isSuccess: gemIsSuccess } = useGemByIdQuery(id);

		return (
			<GemCard
				style={styles.marginRight10}
				isSkeleton={gemData && gemIsSuccess ? false : true}
				gem={gemData ?? null}
				size={"small"}
				onPress={() =>
					navigate("gemDetails", { gemId: gemData?.id, gem: gemData })
				}
			/>
		);
	};

	const renderContentBlocks: ListRenderItem<ContentBlocks> = ({ item }) => {
		return (
			<StoryContentRenderer
				attributes={item?.attributes}
				layout={item?.layout}
			/>
		);
	};

	const footerComponent = () => {
		if ((!gemsArray || gemsArray.length === 0) && !playbookId) {
			return null;
		}
		return (
			<>
				<Text style={styles.headerTitle}>{t("gems_in_this_story")}</Text>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal>
					{playbookId
						? playbookData?.gems?.map((item: Gem, index: number) => {
							return (
								<View key={index}>
									<GemCard
										style={styles.marginRight10}
										isSkeleton={item && playbookIsSuccess ? false : true}
										gem={item ?? null}
										size={"small"}
										onPress={() =>
											navigate("gemDetails", {
												gemId: item?.id,
												gem: item,
											})
										}
									/>
								</View>
							);
						})
						: gemsArray.map((id: number) => {
							return <GemRender id={id} />;
						})}
				</ScrollView>
			</>
		);
	};

	return (
		<View style={styles.container}>
			{/* <Text style={styles.seoTitle}>{story.seo_title}</Text>
      <Text style={styles.seoDes}>{story.seo_description}</Text> */}
			<FlatList
				style={styles.contentList}
				data={contentBlocks}
				renderItem={renderContentBlocks}
				ListFooterComponent={footerComponent}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingBottom: 20,
		zIndex: 100,
		width: variables.dimensions.width * 0.9,
		alignSelf: "center",
	},
	seoDes: {
		...typography.largeParagraph,
		marginBottom: 20,
		lineHeight: 24,
	},
	seoTitle: {
		...typography.pullQuote,
		marginBottom: 20,
	},
	contentList: {
		marginTop: 0,
	},
	marginRight10: { marginRight: 10 },
	headerTitle: { marginVertical: 16, ...typography.h3 },
});

export default StoryContent;
