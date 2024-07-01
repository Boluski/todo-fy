"use client";
import {
  Box,
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
  Checkbox,
  CloseButton,
  Progress,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { TbSubtask } from "react-icons/tb";
import { useState } from "react";
import Subtask from "./Subtask";

import { Interweave } from "interweave";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

import { xray } from "../utils/xray";

// const content = "";

// '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

export default function Card(props: any) {
  const [opened, { open, close }] = useDisclosure(false);

  const [editableOpen, { toggle }] = useDisclosure(true);

  const [title, setTitle] = useState(props.title);
  const [label, setLabel] = useState("#ffffff");

  const content: string = props.description;
  const [plainDescription, setPlainDescription] = useState("");
  // const shortDescription = useEditor({ extensions: [StarterKit], content });

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
            //    styles={xray}
          >
            <Title lineClamp={2} order={3}>
              {title}
            </Title>
            <Text pt={5} lineClamp={3}>
              {editor?.getText()}
            </Text>
            <Group pt={10} justify="end">
              <TbSubtask size={"1.2rem"} />
            </Group>
          </Stack>
        </Stack>
      </Paper>
      <Modal
        opened={opened}
        // scrollAreaComponent={ScrollArea.Autosize}
        onClose={() => {
          close();
          props.setDisableCardDrag(false);
          props.setDisableListDrag(false);
          console.log(editor?.getText());
        }}
        title={"Card Details"}
        centered
        size={"xl"}
        styles={{ title: { fontSize: "2rem", fontWeight: "bolder" } }}
      >
        <Stack
          // styles={xray}
          gap={20}
          mih={"40rem"}
          mah={"40rem"}
        >
          <Group
            // justify={"end"}
            justify="space-between"
            //  styles={xray}
          >
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
          <Group
          // justify="end"
          >
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
            {/* ------------------------------------------------ */}
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
                Save
              </Button>
            </Group>
          </Group>
          <Group>
            <Text size="1.5rem">Subtasks:</Text>
          </Group>
          <Group>
            <Progress
              w="100%"
              size={"md"}
              color="green.4"
              radius={"md"}
              value={45}
            />
          </Group>

          <Stack
            gap={0}
            style={{
              borderBottom: "2px solid black",
            }}
          >
            <Subtask isChecked={false} subTitle={"Nice this guy is cool"} />
            <Subtask isChecked={true} subTitle={"Nice this guy is cool"} />
            <Subtask isChecked={true} subTitle={"Nice this guy is cool"} />
            <Subtask isChecked={false} subTitle={"Nice this guy is cool"} />
          </Stack>

          <Group pb={20} justify="space-between">
            <TextInput size="md" w={"36rem"} variant="filled" />
            <Button size="md" color="green.8">
              Add Subtask
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
