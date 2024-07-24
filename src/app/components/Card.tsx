"use client";
import {
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Modal,
  TextInput,
  ColorPicker,
  ColorSwatch,
  DEFAULT_THEME,
  Button,
  Progress,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { TbSubtask } from "react-icons/tb";
import { GrTextAlignFull } from "react-icons/gr";
import { useState } from "react";
import Subtask from "./Subtask";

import { Interweave } from "interweave";

import { listType, subtaskType, changeLogType } from "../utils/todofyTypes";
import generateID from "../utils/generateID";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

export default function Card(props: any) {
  const [opened, { open, close }] = useDisclosure(false);
  const [editableOpen, { toggle }] = useDisclosure(true);

  const [title, setTitle] = useState(props.title);
  const [label, setLabel] = useState(props.label);

  const content: string = props.description;
  const newLists: listType[] = [...props.lists];

  const [newSubtask, setNewSubtask] = useState("");

  const [cardSubtasks, setCardSubtasks] = useState<subtaskType[]>(
    props.subtasks
  );
  const completedTasks = cardSubtasks.filter(
    (task) => task.checked == true
  ).length;

  const allTasks = cardSubtasks.length;

  const [percent, setPercent] = useState<number>(
    (completedTasks / allTasks) * 100
  );

  const themeArray = [
    "#ffffff",
    DEFAULT_THEME.colors.green[8],
    DEFAULT_THEME.colors.blue[8],
    DEFAULT_THEME.colors.red[8],
    DEFAULT_THEME.colors.violet[8],
    DEFAULT_THEME.colors.orange[8],
    DEFAULT_THEME.colors.cyan[8],
    DEFAULT_THEME.colors.teal[8],
    DEFAULT_THEME.colors.lime[8],
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  return (
    <>
      <Paper shadow="sm" opacity={props.alpha}>
        <Stack
          bg={label}
          style={{ borderRadius: "0.2rem" }}
          onClick={() => {
            // Open the card details and disable all drag and drop features.
            open();
            props.setDisableCardDrag(true);
            props.setDisableListDrag(true);
          }}
        >
          <Stack
            gap={0}
            style={{
              borderBottomRightRadius: "inherit",
              borderTopRightRadius: "inherit",
            }}
            bg={"white"}
            ml={8}
            p={10}
          >
            <Title lineClamp={2} order={3}>
              {title}
            </Title>
            <Text pt={5} lineClamp={3}>
              {editor?.getText()}
            </Text>
            <Group pt={10} justify="end" pr={10}>
              {cardSubtasks.length != 0 ? <TbSubtask size={"1.2rem"} /> : null}
              {editor?.getText() != "" ? <GrTextAlignFull /> : null}
            </Group>
          </Stack>
        </Stack>
      </Paper>
      {/*----------Card Details Modal----------*/}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={"Card Details"}
        centered
        size={"xl"}
        styles={{ title: { fontSize: "2rem", fontWeight: "bolder" } }}
      >
        <Stack gap={20} mih={"40rem"} mah={"40rem"}>
          <Group justify="space-between">
            <Text size="1.5rem">Title:</Text>
            <TextInput
              size="md"
              w={"42rem"}
              variant="filled"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
          </Group>
          <Group>
            <Group w={"100%"}>
              <Text size="1.5rem">Label:</Text>
              <ColorSwatch w={"5rem"} color={label} />
            </Group>
            <ColorPicker
              w={"26rem"}
              format="hex"
              withPicker={false}
              fullWidth
              value={label}
              onChange={setLabel}
              focusable={true}
              swatchesPerRow={9}
              swatches={themeArray}
            />
          </Group>
          <Group>
            <Text size="1.5rem">Description:</Text>
            <Stack
              onDoubleClick={toggle}
              w={"100%"}
              gap={0}
              display={!editableOpen ? "none" : "flex"}
              bg={"gray.1"}
              style={{ borderRadius: "5px" }}
              p={30}
            >
              <Interweave content={editor?.getHTML()} />
            </Stack>

            <RichTextEditor
              hidden={editableOpen}
              w={"100%"}
              mih={"20rem"}
              editor={editor}
            >
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>
            <Group
              display={editableOpen ? "none" : "flex"}
              justify="end"
              w={"100%"}
            >
              <Button color="green.8" onClick={toggle}>
                Save Description
              </Button>
            </Group>
          </Group>
          <Group>
            <Text size="1.5rem">Subtasks:</Text>
          </Group>

          {cardSubtasks.length != 0 ? (
            <Group>
              <Progress
                w="100%"
                size={"md"}
                color={"green.8"}
                radius={"md"}
                value={percent}
              />
            </Group>
          ) : null}

          <Stack
            gap={0}
            style={{
              borderBottom: cardSubtasks.length != 0 ? "2px solid gray" : "0px",
            }}
          >
            {cardSubtasks.map((subtask: subtaskType, index) => (
              <Subtask
                key={subtask.subtaskID}
                subtaskID={subtask.subtaskID}
                subTitle={subtask.title}
                isChecked={subtask.checked}
                // util
                projectID={props.projectID}
                cardSubtasks={cardSubtasks}
                setCardSubtasks={setCardSubtasks}
                setPercent={setPercent}
                subtaskIndex={index}
                changeLog={props.changeLog}
                setChangeLog={props.setChangeLog}
              />
            ))}
          </Stack>

          <Group pb={20} justify="space-between">
            <TextInput
              onChange={(e) => {
                setNewSubtask(e.currentTarget.value);
              }}
              value={newSubtask}
              placeholder="Subtask Name"
              size="md"
              w={"36rem"}
              variant="filled"
            />
            <Button
              onClick={() => {
                handleNewSubtask();
              }}
              size="md"
              color="green.8"
            >
              Add Subtask
            </Button>
          </Group>
        </Stack>
      </Modal>
      {/*----------Card Details Modal----------*/}
    </>
  );

  // Creates a new subtask.
  function handleNewSubtask() {
    const newCardSubtasks = [...cardSubtasks];
    const newChangeLog: changeLogType = { ...props.changeLog };
    const uid = generateID().toString();

    // Adds a new subtask to the subtask list ans adds it to the ChangeLog.
    newCardSubtasks.push({
      subtaskID: `S${uid}`,
      title: newSubtask,
      checked: false,
    });
    newChangeLog.subtasks.created.push(uid);

    // Save the ChangeLog to local storage.
    localStorage.setItem(
      `CHL-${props.projectID}`,
      JSON.stringify(newChangeLog)
    );

    // Calculate and update the subtask progress bar percentage.
    const completedTasks = newCardSubtasks.filter(
      (task) => task.checked == true
    ).length;
    const allTasks = newCardSubtasks.length;
    setPercent((completedTasks / allTasks) * 100);

    // Updates all necessary changes.
    setCardSubtasks(newCardSubtasks);
    props.setChangeLog(newChangeLog);
    setNewSubtask("");
  }

  // Runs when the card details modal is closed.
  function handleClose() {
    // Enables the drag and drop features.
    props.setDisableCardDrag(false);
    props.setDisableListDrag(false);

    // Update the Card information.
    newLists[props.listIndex].cards[props.cardIndex].cardTitle = title;
    newLists[props.listIndex].cards[props.cardIndex].cardLabel = label;
    newLists[props.listIndex].cards[props.cardIndex].cardDescription =
      editor?.getHTML() as string;
    newLists[props.listIndex].cards[props.cardIndex].cardSubtasks =
      cardSubtasks;

    // Save the board schema to local storage.
    localStorage.setItem(props.projectID, JSON.stringify(newLists));

    // Update the necessary states and close the modal.
    props.setLists(newLists);
    props.setChangeNumber((changeNumber: number) => changeNumber + 1);
    close();
  }
}
