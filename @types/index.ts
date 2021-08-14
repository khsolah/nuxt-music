export interface Thumbnail {
  url: string
  width: number
  height: number
}

export enum ThumbnailTypes {
  DEFAULT = 'default',
  MEDIUM = 'medium',
  HIGH = 'high',
  STANDARD = 'standard',
  MAXRES = 'maxres'
}

export type Thumbnails = {
  [K in ThumbnailTypes]?: Thumbnail
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
      default?: Thumbnail
      medium?: Thumbnail
      high?: Thumbnail
      standard?: Thumbnail
      maxres?: Thumbnail
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
    thumbnails: Thumbnails
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
    thumbnails: Thumbnails
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

export interface SearchResult {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: Thumbnails
    channelTitle: string
    liveVroadcaseContent: string
    publishTime: string
  }
}
