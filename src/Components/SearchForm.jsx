import { useForm } from 'react-hook-form';
import { SearchButton,StyledSearchForm,SearchInput } from './styled';
export function SearchForm({addSearchText}){
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    addSearchText(data.searchwords);
  };
  return(
  <StyledSearchForm onSubmit={handleSubmit(onSubmit)}>

    <SearchInput
    {...register("searchwords")}
     id="searchwords"></SearchInput>
    <SearchButton type="submit">Search</SearchButton>

</StyledSearchForm>

  );


}