import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import { roomEquipment } from "../../data/reservation/room-features";
import { roomSoftware } from "../../data/reservation/room-features";

const FeaturesPicker: FC = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-row justify-center gap-4 w-full">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Equipment</legend>
        {roomEquipment.map((feature) => (
          <label className="label " key={feature.value}>
            <input
              type="checkbox"
              className="checkbox"
              value={feature.value}
              {...register("equipment")}
            />
            {feature.label}
          </label>
        ))}
      </fieldset>
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Software</legend>
        {roomSoftware.map((feature) => (
          <label className="label" key={feature.value}>
            <input
              type="checkbox"
              className="checkbox"
              value={feature.value}
              {...register("software")}
            />
            {feature.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default FeaturesPicker;
