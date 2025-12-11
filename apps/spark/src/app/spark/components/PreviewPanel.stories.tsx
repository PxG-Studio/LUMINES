import type { Meta, StoryObj } from '@storybook/react';
import PreviewPanel from './PreviewPanel';

const meta: Meta<typeof PreviewPanel> = {
  title: 'SPARK/PreviewPanel',
  component: PreviewPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PreviewPanel>;

const sampleCode = `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        float moveHorizontal = Input.GetAxis("Horizontal");
        float moveVertical = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(moveHorizontal, 0f, moveVertical);
        rb.AddForce(movement * speed);
    }
}`;

export const Default: Story = {
  args: {
    code: sampleCode,
    scriptName: 'PlayerController',
    engine: 'unity',
  },
};

export const Empty: Story = {
  args: {
    code: '',
    scriptName: '',
  },
};

export const GodotCode: Story = {
  args: {
    code: `extends Node2D

@export var speed: float = 200.0

func _ready():
    print("Player ready")

func _process(delta):
    var input = Vector2.ZERO
    if Input.is_action_pressed("ui_right"):
        input.x += 1
    if Input.is_action_pressed("ui_left"):
        input.x -= 1
    
    position += input * speed * delta`,
    scriptName: 'Player',
    engine: 'godot',
  },
};

