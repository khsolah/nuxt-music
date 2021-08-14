import { Thumbnails, ThumbnailTypes } from '~/@types'

const iso8601DurationRegex =
  /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

export const convertISO8601Durations = (duration: string) => {
  const matches = duration.match(iso8601DurationRegex)

  const minutes = matches?.[7] === undefined ? 0 : +matches[7]
  const seconds = matches?.[8] === undefined ? 0 : +matches[8]
  const time = minutes * 60 + seconds

  return {
    minutes,
    seconds,
    time
  }
}

export const getThumbnail = (thumbnails: Thumbnails): string =>
  thumbnails[Object.keys(thumbnails)[0] as ThumbnailTypes]!.url
