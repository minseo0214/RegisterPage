import React from 'react'

interface FeedInfo {
  id: number
  name: string
  text: string
}

const FeedBox = ({
  feed,
  refetch,
}: {
  feed: FeedInfo
  refetch: () => Promise<void>
}) => {
  return (
    <div className="feedBox" key={feed.id}>
      <div>{feed.name}</div>
      <div>{feed.text}</div>
      <button
        className="button"
        onClick={async () => {
          await deleteFeed(feed.id)
          refetch()
        }}
      >
        delete
      </button>
    </div>
  )
}

const createFeed = async (text: string) => {
  await fetch(`/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  })
}

const deleteFeed = async (id: number) => {
  await fetch(`/feed/${id}`, {
    method: 'DELETE',
  })
}

export default function FeedPage() {
  const [feed, setFeed] = React.useState('')
  const [feedList, setFeedList] = React.useState<FeedInfo[]>()

  const refetch = React.useCallback(async () => {
    const fetched = await fetch(`/feed`)
    const data = await fetched.json()
    setFeedList(data)
  }, [])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div>
      <div>TextList</div>
      <div>
        <input
          placeholder="Input Text"
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
          onKeyPress={async (e) => {
            // review: 공백 검사가 실제로 잘 작동하고 있지 않습니다.
            if (e.key === 'Enter') {
              const trimFeed = feed.trim()
              if (trimFeed !== '') {
                await createFeed(trimFeed)
                refetch()
                setFeed('')
              }
            }
          }}
        />
      </div>
      <div className="TextListBox">
        {feedList &&
          feedList.map((feed: FeedInfo) => (
            <FeedBox key={feed.id} feed={feed} refetch={refetch} />
          ))}
      </div>
    </div>
  )
}
