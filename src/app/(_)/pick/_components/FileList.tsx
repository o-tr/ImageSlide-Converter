"use client";
import {FC, useEffect, useRef, createContext, CSSProperties, useMemo, useContext} from "react";
import {arrayMove, SortableContext, verticalListSortingStrategy,useSortable} from "@dnd-kit/sortable";
import {Table, TableColumnsType, Button, Flex} from "antd";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {SelectedFile} from "@/_types/file-picker";
import {useAtom} from "jotai";
import {SelectedFilesAtom} from "@/atoms/file-drop";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import { HolderOutlined } from '@ant-design/icons';
import {MdDeleteOutline} from "react-icons/md";
import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});

const DragHandle: FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <div
      ref={setActivatorNodeRef}
      className={"absolute left-0 top-0 w-full h-full grid place-items-center cursor-move"}
      {...listeners}
    >
      <Button
        type="text"
        size="small"
        icon={<HolderOutlined />}
      />
    </div>
  );
};

const Preview: FC<{ canvas: HTMLCanvasElement }> = ({ canvas }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
    canvas.classList.add("object-contain","max-h-32","max-w-32");
    ref.current?.append(canvas);
    return ()=>void ref.current?.removeChild(canvas);
  },[]);
  
  return <div className={"w-128 text-center"} ref={ref}/>
};

const Actions: FC<{value: SelectedFile}> = ({value}) => {
  const [, setFiles] = useAtom(SelectedFilesAtom);

  const onDelete=()=>{
    setFiles((prevState) => prevState.filter((item) => item.id !== value.id));
  }

  return (
    <Button type="text" icon={<MdDeleteOutline />} onClick={onDelete}/>
  );
}

const columns: TableColumnsType<SelectedFile> = [
  { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
  { title: 'Image', width: 128, render: (data) => <Preview canvas={data.canvas}/> },
  { title: 'File Name', dataIndex: 'fileName' },
  { title: 'Actions', width: 80, render: (value) => <Actions value={value}/>},
];

export const FileList = () => {
  const [files, setFiles] = useAtom(SelectedFilesAtom);
  
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setFiles((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.id === active?.id);
        const overIndex = prevState.findIndex((record) => record.id === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  if (files.length === 0) return <div className={"flex-1 grid place-items-center"}>
    <Flex vertical>
      <h2 className={"text-2xl"}>利用可能な形式</h2>
      <p>ローカルファイル: PDF/画像</p>
      <p>GoogleDrive: PDF/画像/GoogleSlides</p>
    </Flex>
  </div>;

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext items={files.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Table
          rowKey="id"
          components={{ body: { row: Row } }}
          columns={columns}
          dataSource={files}
          className={"w-full"}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });
  
  const style: CSSProperties = {
    ...props.style,
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };
  
  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );
  
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};
