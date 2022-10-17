import styled from 'styled-components';

const Container = styled.section`
    width: 50%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 40px;;
`

const Title = styled.h2`
    font-size: 2rem;
    color: ${props => props.theme.logColor};
`

const Alert = styled.p`
    margin: 30px 0;
    font-size: 0.5rem;
    color: red;
`

const Row = styled.div`
    margin-bottom: 20px;
    width: 100%;
`
const Label = styled.div`
    font-size: 0.7rem;
    margin-bottom: 5px;
    color: ${props => props.theme.logColor};
`

const Input = styled.input`
    width: 100%;
    height: 32px;
    padding: 7px 10px;
    border: 1px solid ${props => props.theme.logInputBorderColor};
    border-radius: 3px;
    ::placeholder {
        color: #A2A2A6;
    }
    :focus {
        outline-color: ${props => props.theme.logInputBorderColor};
    }
`

const Btn = styled.button`
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    border-radius: 3px;
    border: none;
    background-color: ${props => props.theme.logBtnBackColor};
`

const Link = styled.a`
    margin: 10px 0;
    font-size: 0.7rem;
`

function LogBox () {
    return(
    <Container>
        <Title>로그인</Title>
        <Alert>* 아이디 또는 비밀번호가 올바르지 않습니다.</Alert>
        <Row>
            <Label>아이디</Label>
            <Input></Input>
        </Row>
        <Row>
            <Label>비밀번호</Label>
            <Input></Input>
        </Row>
        <Btn>
            로그인
        </Btn>
        <Link>회원가입</Link>
        <Link>아이디/비밀번호 찾기</Link>
    </Container>
    )
}
export default LogBox;