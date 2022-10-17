import styled from 'styled-components';

const Container = styled.section`
    width: 50%;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 40px;;
`

const Title = styled.h2`
    font-size: 2rem;
    color: ${props => props.theme.logColor};
    margin-bottom: 40px;
`

const FieldSet = styled.div`
    margin-bottom: 20px;
    width: 100%;
`
const Label = styled.div`
    font-size: 0.7rem;
    margin-bottom: 5px;
    color: ${props => props.theme.logColor};
`
const Alert = styled.span`
    float: right;
    font-size: 0.5rem;
    color: red;
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

function SignUpBox () {
    return(
    <Container>
        <Title>회원가입</Title>
        <FieldSet>
            <Label>이메일</Label>
            <Input></Input>
        </FieldSet>
        <FieldSet>
            <Label>
                아이디
                <Alert>* 사용 가능한 아이디입니다.</Alert>
            </Label>
            <Input></Input>
        </FieldSet>
        <FieldSet>
            <Label>비밀번호</Label>
            <Input></Input>
        </FieldSet>
        <FieldSet>
            <Label>
                비밀번호 확인
                <Alert>* 비밀번호가 일치하지 않습니다.</Alert>
            </Label>
            <Input></Input>
        </FieldSet>
        <Btn>
            회원가입
        </Btn>
    </Container>
    )
}
export default SignUpBox;