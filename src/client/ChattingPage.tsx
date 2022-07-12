import React from 'react'

interface TextInfo {
  id: number
  user_id: number
  text: string
}

const [userId, setUserId] = React.useState<number>()
const [text, setText] = React.useState('')
const [textList, setTextList] = React.useState<TextInfo[]>()

const refetch = React.useCallback(async () => {
  const fetched = await fetch(`/chatting`)
  const data = await fetched.json()
  setTextList(data.rows)
}, [])

React.useEffect(() => {
  refetch()
}, [refetch])

// review: 컴포넌트로 쪼개 주세요.
const TextBox = (text: TextInfo) => {
  return (
    <div className="textBox" key={text.id}>
      <div>{text.text}</div>
      <button
        className="button"
        onClick={() => {
          // review: 서버에서 권한을 판단해야 합니다.
          deleteText(text.id)
        }}
      >
        delete
      </button>
    </div>
  )
}

// review: text, chatting 둘 중 하나로 통일해야 합니다.
// review: user_id는 쿠키로 서버에서 검증하는 것이고 여기에서 받으면 안 됩니다.
const createText = async (user_id: number, text: string) => {
  await fetch(`/chatting/${user_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  })
  refetch()
}

const deleteText = async (id: number) => {
  await fetch(`/chatting/${id}`, {
    method: 'DELETE',
  })
  refetch()
}

// review: 컴포넌트로 쪼개 주세요.
export default function ChattingPage() {
  return (
    <div>
      <div>Chatting</div>
      <div>
        <input
          placeholder="Input Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key == 'Enter') {
              setText(text.trim())
              if (text !== '') {
                createText(userId, text)
                setText('')
              }
            }
          }}
        ></input>
      </div>
      <div className="chattingBox">
        {textList && textList.map((text: TextInfo) => TextBox(text))}
      </div>
    </div>
  )
}
