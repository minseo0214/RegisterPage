import React from 'react'

interface TextInfo {
  id: number
  user_id: number
  text: string
}

const TextBox = (text: TextInfo, refetch: () => Promise<void>) => {
  return (
    <div className="textBox" key={text.id}>
      {/* text name으로 변경하기 */}
      <div>{text.user_id}</div>
      <div>{text.text}</div>
      <button
        className="button"
        onClick={() => {
          deleteText(text.id, refetch)
        }}
      >
        delete
      </button>
    </div>
  )
}

// review: user_id는 쿠키로 서버에서 검증하는 것이고 여기에서 받으면 안 됩니다.
const createText = async (text: string, refetch: () => Promise<void>) => {
  await fetch(`/text`, {
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

const deleteText = async (id: number, refetch: () => Promise<void>) => {
  await fetch(`/text/${id}`, {
    method: 'DELETE',
  })
  refetch()
}

export default function TextPage() {
  const [text, setText] = React.useState('')
  const [textList, setTextList] = React.useState<TextInfo[]>()

  const refetch = React.useCallback(async () => {
    const fetched = await fetch(`/text`)
    const data = await fetched.json()
    setTextList(data.rows)
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key == 'Enter') {
              setText(text.trim())
              if (text !== '') {
                createText(text, refetch)
                setText('')
              }
            }
          }}
        ></input>
      </div>
      <div className="TextListBox">
        {textList && textList.map((text: TextInfo) => TextBox(text, refetch))}
      </div>
    </div>
  )
}
