class PostsController < ApplicationController
  require 'RMagick'
  before_action :set_post, only: [:show, :edit, :update, :destroy, :like, :unlike, :dislike, :undislike]
	before_action :authenticate_user!, except: [:show, :index]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.paginate(page: params[:page]).order("created_at DESC")
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  # GET /posts/new
  def new
    @post = current_user.posts.build
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = current_user.posts.build(post_params)

    respond_to do |format|
      if @post.save
				pixelate
        format.html { redirect_to @post, notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def like
    @post.liked_by current_user
    redirect_to @post
  end

  def unlike
  	@post.unliked_by current_user
  	redirect_to @post
	end

  def dislike
    @post.disliked_by current_user
    redirect_to @post
  end

  def undislike
  	@post.undisliked_by current_user
  	redirect_to @post
	end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :image, :resolution_level, :name)
    end

		# TODO: Refactor this shit. Using Ruby style!
    def pixelate
			max_level = @post.resolution_level - 1
			max_resolution = 2**max_level;

			img = Magick::ImageList.new(@post.image.path(:medium))
			step = img.columns / max_resolution
			template = Magick::Image.new(step, step)
			pixel_matrices = Array.new(max_level + 1)

			# Initialize 3D array: [level][row][col]
			for level in 0..max_level do
				pixel_matrices[level] = level == max_level ? Array.new(2**level) { Array.new(2**level) } : nil
			end

			for r in 0...max_resolution do
				for c in 0...max_resolution do
					# Cut image into blocks
					block = img.export_pixels_to_str( c * step, 
																					 r * step,
																					 step,
																					 step )
					average_pixel = template.import_pixels(0,0,step, step, "RGB", block).scale(1,1).pixel_color(0,0)

					# Translate red,green,blue value into 8-bit depth from 16-bit depth (default RMagick)
					pixel_matrices[max_level][r][c] = [average_pixel.red, average_pixel.green, average_pixel.blue].map! { |x| convert_16bit_to_8bit_with_damping(x) }
				end
			end

			# Compute the remaining levels
			for level in max_level.downto(1) do
				average = Array.new(2**(level-1)) { Array.new(2**(level-1)) { Array.new(3, 0.0) } }
				for r in 0...2**level do
					for c in 0...2**level do
						average[r / 2][c / 2][0] += pixel_matrices[level][r][c][0] / 4
						average[r / 2][c / 2][1] += pixel_matrices[level][r][c][1] / 4
						average[r / 2][c / 2][2] += pixel_matrices[level][r][c][2] / 4
					end
				end
				pixel_matrices[level-1] = Array.new(average)
			end
			@post.pixel_matrices = pixel_matrices
			@post.save
		end		

		def convert_16bit_to_8bit_with_damping(x, damping = 0)
			eight_range = 255.0
			sixteen_range = Magick::QuantumRange

			return x * eight_range / sixteen_range - damping
		end	
end
