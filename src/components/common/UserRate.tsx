
import styled from "styled-components";
import Rate from "rc-rate";
import 'rc-rate/assets/index.css';

const StyledRate = styled(Rate)`
&.rc-rate {
  font-size: ${({ size }: { size: number }) => size}px;
}
`

export default function UserRate(props: any) {
  return <StyledRate {...props} />
}