interface thumbnail {
  url: string
  width: number
  height: number
}

export interface HotVideoItem {
  id: string
  snippet: {
    publishedAt: string
    categoryId: string
    channelId: string
    channelTitle: string
    description: string
    liveBroadcastContent: string
    localized: {
      title: string
      description: string
    }
    thumbnails: {
      default?: thumbnail
      medium?: thumbnail
      high?: thumbnail
      standard?: thumbnail
      maxres?: thumbnail
    }
    title: string
    tags: string[]
  }
  status: {
    embeddable: boolean
    license: string
    madeForKids: boolean
    publicStatsViewable: boolean
    privacyStatus: 'public'
    uploadStatus: string
  }
  statistics: {
    commentCount: string
    dislikeCount: string
    favoriteCount: string
    likeCount: string
    viewCount: string
  }
  player: {
    embedHtml: string
  }
}

export interface PlayListItem {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: thumbnail
      medium?: thumbnail
      high?: thumbnail
      standard?: thumbnail
      maxres?: thumbnail
    }
    channelTitle: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
    videoOwnerChannelTitle: string
    videoOwnerChannelId: string
  }
  contentDetails: {
    videoId: string
    videoPublishedAt: string
  }
  status: {
    privacyStatus: string
  }
}
