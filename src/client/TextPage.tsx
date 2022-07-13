import React from 'react'

interface TextInfo {
  id: number
  name: string
  text: string
}

const TextBox = ({
  text,
  refetch,
}: {
  text: TextInfo
  refetch: () => Promise<void>
}) => {
  return (
    <div className="textBox" key={text.id}>
      <div>{text.name}</div>
      <div>{text.text}</div>
      <button
        className="button"
        onClick={async () => {
          await deleteText(text.id)
          refetch()
        }}
      >
        delete
      </button>
    </div>
  )
}

const createText = async (text: string) => {
  await fetch(`/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  })
}

const deleteText = async (id: number) => {
  await fetch(`/text/${id}`, {
    method: 'DELETE',
  })
}

export default function TextPage() {
  const [text, setText] = React.useState('')
  const [textList, setTextList] = React.useState<TextInfo[]>()

  const refetch = React.useCallback(async () => {
    const fetched = await fetch(`/text`)
    const data = await fetched.json()
    setTextList(data)
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
          onKeyPress={async (e) => {
            // review: 공백 검사가 실제로 잘 작동하고 있지 않습니다.
            if (e.key === 'Enter') {
              setText(text.trim())
              if (text !== '') {
                await createText(text)
                refetch()
                setText('')
              }
            }
          }}
        />
      </div>
      <div className="TextListBox">
        {textList &&
          textList.map((text: TextInfo) => (
            <TextBox key={text.id} text={text} refetch={refetch} />
          ))}
      </div>
    </div>
  )
}
