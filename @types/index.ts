interface thumbnail {
  url: string
  width: number
  height: number
}

export interface Video {
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
      default: thumbnail
      medium: thumbnail
      high: thumbnail
      standard: thumbnail
      maxres: thumbnail
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
