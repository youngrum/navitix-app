"use client";

import { TheaterSearchResponse } from "@/types/theater";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { AllTheatersContext } from "@/contexts/AllTheatersContext";

interface autCompleteProps {
  setData: Dispatch<SetStateAction<TheaterSearchResponse[]>>;
  setBoolean: Dispatch<SetStateAction<boolean>>;
}

export default function SearchTheaterAutocomplete({
  setData,
  setBoolean,
}: autCompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TheaterSearchResponse[]>([]);
  const allTheaters = useContext(AllTheatersContext); // 映画館情報をContextから所得

  const onInputChangehundler = (newInputValue: string) => {
    setInputValue(newInputValue);

    // 入力値が空でない場合にのみ、候補リストを開く
    if (newInputValue) {
      setOpen(true);

      // フィルタリングロジック
      const filtered = allTheaters.filter(
        (theater) =>
          theater.name.includes(newInputValue) ||
          theater.address.includes(newInputValue)
      );
      console.log(filtered);
      setSuggestions(filtered);
      setData(filtered);
      setBoolean(true);
    } else {
      setOpen(false);
      setSuggestions([]);
    }
  };

  const searchHundler = (newValue: string | undefined) => {
    if (newValue) {
      const filtered = allTheaters.filter(
        (theater) =>
          theater.name.includes(newValue) || theater.address.includes(newValue)
      );
      setData(filtered);
    } else {
      setData([]);
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Autocomplete
        freeSolo
        fullWidth
        options={suggestions.map((option) => `${option.name}`)}
        inputValue={inputValue}
        onInputChange={(_event, inputValue) => {
          onInputChangehundler(inputValue);
        }} // _eventは使わないが第一引数に置かないとエラーになるので回避のため_つける
        open={open}
        onBlur={() => {
          setOpen(false);
          searchHundler(inputValue);
        }}
        onClick={()=>{setOpen(false)}}
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
      <SearchOutlinedIcon
        fontSize="large"
        color="secondary"
        sx={{ height: 50, width: 50, pt: 1 }}
      />
    </Stack>
  );
}
