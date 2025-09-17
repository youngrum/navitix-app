"use client";

import { TheaterSearchResponse } from "@/types/theater";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Dispatch, SetStateAction, useState } from "react";
import { Autocomplete, Stack, TextField } from "@mui/material";

interface autCompleteProps {
  allTheatersProps: TheaterSearchResponse[];
  setData: Dispatch<SetStateAction<TheaterSearchResponse[]>>;
  setBoolean: Dispatch<SetStateAction<boolean>>;
}

export default function SearchTheaterAutocomplete({
  allTheatersProps,
  setData,
  setBoolean,
}: autCompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TheaterSearchResponse[]>([]);

  const onInputChangehundler = (newInputValue: string) => {
    setInputValue(newInputValue);

    // 入力値が空でない場合にのみ、候補リストを開く
    if (newInputValue.length > 0) {
      setOpen(true);

      // フィルタリングロジック
      const filtered = allTheatersProps.filter(
        (theater) =>
          theater.name.includes(newInputValue) ||
          theater.address.includes(newInputValue)
      );
      console.log(filtered);
      setSuggestions(filtered);
      setData(suggestions);
      setBoolean(true);
    } else {
      setOpen(false);
      setSuggestions([]);
    }
  };

  const searchHundler = (newValue: string | undefined) => {
    if (newValue) {
      const filtered = allTheatersProps.filter(
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
        options={suggestions.map((option) => `${option.name} - ${option.city}`)}
        inputValue={inputValue}
        onInputChange={(_event, value) => {
          onInputChangehundler(value);
        }} // _eventは使わないが第一引数に置かないとエラーになるので回避のため_つける
        open={open}
        onBlur={() => {
          setOpen(false);
          searchHundler(inputValue);
        }}
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
