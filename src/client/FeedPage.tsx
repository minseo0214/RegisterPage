import React from 'react'
import { useLocation } from 'react-router-dom'

interface FeedInfo {
  id: number
  name: string
  text: string
}

//button disabled
const FeedBox = ({
  feed,
  userName,
  refetch,
}: {
  feed: FeedInfo
  userName: string
  refetch: () => Promise<void>
}) => {
  return (
    <div className="feedBox" key={feed.id}>
      <div className="feedUser">{feed.name}</div>
      <div className="feedText">{feed.text}</div>
      <button
        className="feedButton"
        onClick={async () => {
          await deleteFeed(feed.id)
          refetch()
        }}
        style={{ visibility: userName === feed.name ? 'visible' : 'hidden' }}
      >
        delete
      </button>
    </div>
  )
}

const createFeed = async (text: string) => {
  await fetch(`/api/feed`, {
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
  await fetch(`/api/feed/${id}`, {
    method: 'DELETE',
  })
}

interface UserName {
  userName: string
}

export default function FeedPage() {
  const [feed, setFeed] = React.useState('')
  const [feedList, setFeedList] = React.useState<FeedInfo[]>()
  const { state } = useLocation()

  const data = state as UserName
  const userName = data.userName

  const refetch = React.useCallback(async () => {
    const fetched = await fetch(`/api/feed`)
    const data = await fetched.json()
    setFeedList(data)
  }, [])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div>
      <div className="feedTitle">Chatting Feed</div>
      <div className="inputBox">
        <div className="inputName"> {userName}</div>
        <input
          className="inputText"
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
      <div className="feedBoxWrap">
        {feedList &&
          feedList.map((feed: FeedInfo) => (
            <FeedBox
              key={feed.id}
              feed={feed}
              userName={userName}
              refetch={refetch}
            />
          ))}
      </div>
    </div>
  )
}
