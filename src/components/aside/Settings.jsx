import {
  Box,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import {
  materialFlowDataNameMap,
  peopleFlowDataNameMap,
} from "../../constants/flowData";
import { prefectureIdToName } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";

export const Settings = () => {
  const {
    years,
    selectedYear,
    setSelectedYear,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedType,
    setSelectedType,
    selectedDataType,
    setSelectedDataType,
  } = useContext(DataContext);
  // const [direction, setDirection] = useState("in");
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5">Settings</Typography>

      <Box display="flex" alignItems="center">
        <Typography variant="body">選択した都道府県:</Typography>
        <Select
          size="small"
          value={
            isNotNullOrUndefined(selectedPrefecture) ? selectedPrefecture : ""
          }
          onChange={(e) => setSelectedPrefecture(Number(e.target.value))}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
          displayEmpty
          renderValue={(selected) =>
            selected ? prefectureIdToName[selected] : "未選択"
          }
        >
          {Object.entries(prefectureIdToName).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box display="flex" alignItems="center">
        <Typography variant="body">
          {selectedDataType === "people" ? "移動手段：" : "輸送手段："}
        </Typography>
        <Select
          size="small"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
        >
          {Object.values(
            selectedDataType === "people"
              ? peopleFlowDataNameMap
              : materialFlowDataNameMap
          ).map((flowData) => (
            <MenuItem key={flowData.id} value={flowData.id}>
              {flowData.displayName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box display="flex" alignItems="center">
        <Typography variant="body">選択年：</Typography>
        <Select
          size="small"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {/* <Box display="flex" alignItems="center">
        <Typography variant="body">方向：</Typography>
        <ToggleButtonGroup
          value={direction}
          onChange={(_, value) => setDirection(value)}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="in">
            入る
          </ToggleButton>
          <ToggleButton size="small" value="out">
            出る
          </ToggleButton>
        </ToggleButtonGroup>
      </Box> */}
      <Box display="flex" alignItems="center">
        <Typography variant="body">種類：</Typography>
        <ToggleButtonGroup
          value={selectedDataType}
          onChange={(_, value) => {
            setSelectedDataType(value);
            setSelectedType(value === "people" ? "total" : "totalAll");
          }}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="material">
            物流
          </ToggleButton>
          <ToggleButton size="small" value="people">
            人流
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
