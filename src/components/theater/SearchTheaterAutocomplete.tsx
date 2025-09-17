"use client";

import { TheaterSearchResponse } from "@/types/thater";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Dispatch, SetStateAction, useState } from "react";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";

interface autCompleteProps {
    allTheatersProps: TheaterSearchResponse[];
    setData: Dispatch<SetStateAction<TheaterSearchResponse[]>>;
}

export default function SearchTheaterAutocomplete({ allTheatersProps, setData }: autCompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TheaterSearchResponse[]>([]);

  const onInputChangehundler = (newInputValue: string) =>{
    setInputValue(newInputValue);
    
    // 入力値が空でない場合にのみ、候補リストを開く
    if (newInputValue.length > 0) {
      setOpen(true);
      
      // フィルタリングロジック
      const filtered = allTheatersProps.filter(theater =>
        theater.name.includes(newInputValue)
        || theater.address.includes(newInputValue)
      );
      console.log(filtered);
      setSuggestions(filtered);
      setData(suggestions);
    } else {
      setOpen(false);
      setSuggestions([]);
    }
  };

  return (
  <Stack direction="row" alignItems="center">
    <Autocomplete
      freeSolo
      fullWidth
      options={suggestions.map((option) => `${option.name} - ${option.city}`)}
      inputValue={inputValue}
      onInputChange={(_event, value) => { onInputChangehundler(value); }} // _eventは使わないが第一引数に置かないとエラーになるので回避のため_つける
      open={open}
      // renderOption={(props, option) => (
      //   <li {...props} >
      //     <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
      //       {option.name} - {option.city}
      //     </Typography>
      //   </li>
      // )}
      onBlur={()=>{setOpen(false)}}
      renderInput={(params) => (
        <TextField 
          {...params} 
          variant="outlined" 
          id="search-theater"
          size="small"
          margin="normal"
          fullWidth
          color="secondary"
          placeholder="映画館・市区町村を入力"          
        />
      )}
    />
    <SearchOutlinedIcon fontSize="large" color="secondary" />
  </Stack>

  );
  

}