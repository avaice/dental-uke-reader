import type { KVType } from "@misc/types";

export const KVRenderer = (props: { data: KVType; highlight: string[] }) => {
  return (
    <table className="min-w-full border-collapse border text-xs">
      <tbody>
        {props.data.map((property) => (
          <tr key={`${property.key}-${property.value}`}>
            <td
              className="border p-2 pr-2"
              style={{
                backgroundColor: props.highlight.includes(property.key)
                  ? "var(--color-yellow-200)"
                  : "",
              }}
            >
              {property.key}
            </td>
            <td className="border p-2">{property.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
