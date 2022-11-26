import styled from 'styled-components';


const Wrapper = styled.div`
    width: 100%;
    height: fit-content;
    margin-top: 70px;
    display: flex;
    justify-content: right;
`
const SearchInput = styled.input`
    border-radius: 10px;
    border: 1px solid #FFA000;
    padding: 10px;
    ::placeholder {
        color: #A2A2A6;
    }
    :focus {
        outline-color: #FFA000;
    }
`

function Searchbar( props ) {
    return (
        <Wrapper>
            <SearchInput placeholder={props.ph} style={{width : props.width, height: props.height}} />
        </Wrapper>
    )
}

export default Searchbar;