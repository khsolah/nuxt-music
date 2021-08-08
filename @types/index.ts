interface thumbnail {
  url: string
  width: number
  height: number
}

export interface VideoItem {
  id: string
  contentDetails: {
    duration: string
  }
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
  statistics: {
    commentCount: string
    dislikeCount: string
    favoriteCount: string
    likeCount: string
    viewCount: string
  }
}

export interface PlayList {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    channelTitle: string
    description: string
    thumbnails: {
      default?: thumbnail
      medium?: thumbnail
      high?: thumbnail
      standard?: thumbnail
      maxres?: thumbnail
    }
    title: string
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

export interface Player {
  playerInfo: {
    currentTime: number
  }
  loadVideoById: (
    videoId: string,
    startSeconds?: number,
    endSeconds?: number
  ) => void
  seekTo: (seconds: number) => void
}
