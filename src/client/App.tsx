import React from 'react'
import './styles.css'

//CRUD (Create Read Update Delete)
export default function App() {
  // 회원 가입 페이지
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  // 정상적인 이메일 포맷인지 확인
  const isEmail = (email) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

    return emailRegex.test(email)
  }
  // 비밀번호 보안상 적절한지 확인
  // 비밀번호와 비밀번호 확인란이 동일해야함
  // 비밀번호 가리기
  // 비밀번호 DB에 저장할 때는 암호화

  const createUser = async (id: number) => {
    await fetch(`/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    }).then((res) => {
      if (res.ok) {
        alert('생성되었습니다.')
        // history.push(`/`)
      }
    })
    // post json으로 보내면 됨
  }

  const register = () => {
    return (
      <div className="container">
        Welcome
        {/* username */}
        <div>
          username
          <input placeholder="Eneter username" id="name"></input>
        </div>
        {/* email */}
        <div>
          Email
          <input placeholder="Enter email"></input>
        </div>
        {/* password */}
        <div>
          Password
          <input placeholder="Enter password"></input>
        </div>
        {/* confirm password */}
        <div>
          Confirm Password
          <input placeholder="Enter password again"></input>
        </div>
        <button onClick={() => createUser(1)}> submit </button>
      </div>
    )
  }

  return register()
}

// 회원가입

// 로그인

// 글 쓰기
