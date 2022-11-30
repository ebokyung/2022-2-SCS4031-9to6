import styled from "styled-components";

const Wrapper = styled.div`
  margin: 25px auto;
`

const PageUl = styled.ul`
  float: left;
  list-style: none;
  text-align: center;
  border-radius: 3px;
  color: #979797;
  border: 1px solid #D9D9D9a7;
`

const PageLi = styled.li`
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  width: 25px;
  &:hover {
    cursor: pointer;
    color: white;
    background-color: #d9d9d9a7;
  }
  &:focus::after {
    color: white;
    background-color: #D9D9D9a7;
  }
`

const PageSpan = styled.span`
`

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <Wrapper>
      <nav>
        <PageUl>
          {pageNumbers.map((number) => (
            <PageLi key={number}>
              <PageSpan onClick={() => paginate(number)}>
                {number}
              </PageSpan>
            </PageLi>
          ))}
        </PageUl>
      </nav>
    </Wrapper>
  );
};

export default Pagination;