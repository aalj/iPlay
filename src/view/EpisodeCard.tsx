import { Emby } from "@api/emby";
import { Episode } from "@model/Episode";
import { StyleSheet, Text, TouchableOpacity, View, ViewProps, ViewStyle } from "react-native";
import { Image } from '@view/Image';
import { useAppSelector } from "@hook/store";
import FavoriteIconOff from "@asset/favorite_off.svg"
import FavoriteIconOn from "@asset/favorite_on.svg"
import { useState } from "react";
import { printException } from "@helper/log";
import { Toast } from "@helper/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tag } from "./Tag";
import { Like } from "./like/Like";
import { PlayCount } from "./counter/PlayCount";

const style = StyleSheet.create({
    root: {

    },
    basic: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
    },
    cover: {
        width: "35%",
        marginLeft: 10,
        borderRadius: 5,
        flexShrink: 0,
        flexGrow: 0,
    },
    text: {
        flex: 1,
        textAlign: "center",
        paddingLeft: 5,
        paddingRight: 2.5
    },
    title: {
        fontWeight: "600"
    },
    overview: {
        color: "gray",
        maxHeight: 100
    },
    No: {
        overflow: "hidden",
        position: "absolute",
        right: 10,
        bottom: 10,
    },
    icon: {
        width: 32,
    },
    favorite: {
        width: 32,
        height: 32,
        flexShrink: 0,
        flexGrow: 0,
    },
    actionBar: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    }
});

export interface EpisodeCardProps {
    style?: Partial<ViewStyle>
    emby?: Emby|null;
    episode: Episode;
    onPress?: (episode: Episode) => void;
}

export function EpisodeCard({style: extraStyle, emby, episode, onPress}: EpisodeCardProps) {
    const color = useAppSelector(state => state.theme.fontColor);
    const backgroundColor = useAppSelector(state => state.theme.backgroundColor);
    const [favorite, setFavorite] = useState(episode.UserData.IsFavorite)
    const inset = useSafeAreaInsets()
    const markFavorite = (id: number, favorite: boolean) => {
        emby?.markFavorite?.(id, favorite)
            .then(data => {
                setFavorite(data.IsFavorite)
                Toast.show({
                    type: "success",
                    text1: data.IsFavorite ? "已收藏" : "已取消收藏",
                    topOffset: inset.top + 2.5
                })
            })
            .catch(printException)
    }
    return (
        <TouchableOpacity activeOpacity={1.0} onPress={() => onPress?.(episode)}>
        <View style={{...style.basic, backgroundColor, ...extraStyle}}>
            <Image style={{...style.cover, aspectRatio: episode.PrimaryImageAspectRatio}}
                source={{uri: emby?.imageUrl?.(episode.Id, episode.ImageTags.Primary)}} />
            <View style={{...style.text, backgroundColor}}>
                <Text style={{...style.title, color}}>{episode.Name}</Text>
                <Text style={{...style.overview, color}}
                    numberOfLines={10} 
                    ellipsizeMode="tail"
                    >
                    {episode.Overview}
                </Text>
                <View style={style.actionBar}>
                <Like id={Number(episode.Id ?? 0)}
                    emby={emby}
                    isFavorite={episode.UserData.IsFavorite}
                    />
                <PlayCount count={episode?.UserData?.PlayCount ?? 0} />
                </View>
            </View>
            <Tag style={style.No} color="green">
                {episode.IndexNumber}
            </Tag>
        </View>
        </TouchableOpacity>
    )
}