import { useState } from "react";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";

export const SelectDropdownSearch = ({
  data,
  value,
  description,
  setValue,
  placeholder,
}) => {
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = data
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

  return (
    <Combobox
      size="xl"
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          size="xl"
          radius={"xl"}
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value || <Input.Placeholder>{description}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          size="xl"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={placeholder}
        />
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options.length === 0 ? (
            <Combobox.Empty>Không tìm thấy</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
