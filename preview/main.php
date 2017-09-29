<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Photogurus</title>
        <link rel="shortcut icon" type="image/x-icon" href="https://imgd.photogurus.com/assets/preview/images/favicon.ico">
        <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'>
        <?php include_once 'loadassets.php'; ?>

        <!-- Facebook Pixel Code -->
        <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1908341129437529'); // Insert your pixel ID here.
        
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1908341129437529&ev=PageView&noscript=1"
        /></noscript>
        <!-- DO NOT MODIFY -->
        <!-- End Facebook Pixel Code -->
    </head>

    <body >
        <div id="loading">
            <img id="loading-image" src="https://imgd.photogurus.com/assets/preview/images/nilloader.gif" alt="Loading..." />
        </div>
        <div class="pageload" style="display: none;">
            <div class="pageload-inner text-center">
                <img src="https://imgd.photogurus.com/assets/preview/images/nilloader.gif">
            </div>
        </div>
        <div id="wrapper">
            <input type="hidden" id="install_app_url" value="<?= $deepLinkUrl ?>">
            <input type="hidden" id="loggedInUser" value="<?= $userLoggedIn ?>">
            <input type="hidden" id="send_link_url" value="<?= $sendLinkApiUrl ?>">
            <input type="hidden" id="country_code" value="">
            <div id="flip_body" class="flipbook-body disable-select" style="display: none;">
                <?php
                $pathToFreeStories = "";
                if ($userLoggedIn == 1) {
                    $pathToFreeStories = '/?page=mystories';
                    $publicShareStoryNotLoggedIn = 'none';
                    $publicShareStoryLoggedIn = 'block';
                } else {
                    $pathToFreeStories = '/?page=signup';
                    $publicShareStoryNotLoggedIn = 'block';
                    $publicShareStoryLoggedIn = 'none';
                }
                $publicShareStoryNotLoggedIn = 'none';
                $publicShareStoryLoggedIn = 'none';
                ?>
                <div class="activeNav">
                    <div class="active-lines">
                    </div>
                    <div class="home-icon-nav">
                    </div>
                    <div class="share-icon-nav">
                    </div>
                    <div class="share-icon-nav-ios">
                    </div>
                    <div class="likeAndComments">
                        <div class="like-container">
                            <i class="flipbook-like active"></i>
                            <span class="like-count"></span>
                        </div>
                        <div class="comments-container">
                            <i class="flipbook-comments"></i>
                            <span class="comments-count"></span>
                        </div>
                    </div>
                </div>
                <div class="head-container row">
                    
                    <div class="leftArea">
                        <div class="mobile-nav"></div>
                        <div class="spriteCode portraitHome"></div>
                        <div class="spriteCode headerLogo"></div>
                    </div>
                    <div class="heder_wraper col-sm-4">
                    </div>
                    <div class="install-app col-sm-8 row">
                        <div class="app-text  col-sx-5">Looks awesome in app</div>
                        <div class="primary_btn  col-sx-5" id="startUpload" >FREE Install</div>
                        <div class="fl-screen col-sx-2">
                            <a id="fullscreenID" class="fullscreen">  <div class="spriteCode fullscreen fullscreen-logo"></div>              

                            </a>
                        </div>
                    </div>

                    <div class="web-signin col-sm-8">
                        <?php
                        if ($userLoggedIn != 1) {
                            ?>
                            <?php
                        } else {
                            ?>
                            <?php
                        }
                        ?>
                        <div class="fl-screen ">
                            <a id="fullscreenID" class="fullscreen">
                                <div class="spriteCode fullscreen fullscreen-logo"></div>
                            </a>
                        </div>
                    </div>

                </div>
                <div class="rowFlip">
                    <div class="galleria">
                        <div class="galleria-container" >
                            <div class="flip-control-front" >
                                <img src="" id="frontCoverArrow">
                            </div>

                            <div class="flipbookContainer">

                                <div class="flip-control left">
                                    <div id="prev" class="spriteCode leftArrowInnerSpreadDesk"></div>
                                </div>
                              
                                   <?php if ($userLoggedIn == 1 && $sharedStatus == 1000) { ?>
                                    <div class="mainCoverActionButtonContainer editIconLayering">                                                                            
                                        <!--<div class="spriteCode spreadShareIcon mt30"></div>-->
                                        <!--<div class="spriteCode spreadPrintIcon mt30"></div>
                                        <a href="<?=$zuluUrl.$orderId.'&consumer=yes&token='.$authToken?>">
                                        <div class="spriteCode spreadEditIcon mt30"></div>
                                        </a>
                                        <div class="spriteCode spreadInfoIcon mt30"></div>-->                                        
                                    </div>
                                      <?php } ?>
                                       <?php if (($userLoggedIn == 1 && $sharedStatus == 8001) ||$userLoggedIn == 0) { ?>
                                            <!-- <div class="mainCoverActionButtonContainer editIconLayering">  
                                                 <div class="spriteCode spreadPrintIcon"></div> 
                                                  </div>-->                                  
                                      <?php } ?>
                                   
                             
                                
                                <input type="hidden" id="image_count" value="<?= count($imagdetails) ?>">
                                <input type="hidden" id="shared_status" value="<?= $sharedStatus ?>">
                                <input type="hidden" id="device_count" value="<?= $deviceCount ?>">
                                <input type="hidden" id="userLoggedIn" value="<?= $userLoggedIn ?>">
                                <input type="hidden" id="timestamp" value="<?= $timestamp ?>">
                                <input type="hidden" id="order_id" value="<?= $orderId ?>">
                                <input type="hidden" id="visit_count" value="<?= $visitCount ?>">
                                <input type="hidden" id="userLogged" value="1">

                                <div id="flipbook" >
                                    <?php
                                    $allImages = $imagdetails;
                                    $frontCover = array_shift($imagdetails);
                                    $backCover = array_pop($imagdetails);
                                    $frontCoverUrl = $frontCover['spread_url'];
                                    $backCoverUrl = $backCover['spread_url'];
                                    $frontCoverThumbUrl = $frontCover['thumb_url'];
                                    $backCoverThumbUrl = $backCover['thumb_url'];
                                    $frontCoverSpreadId = $frontCover['spread_id'];
                                    $backCoverSpreadId = $backCover['spread_id'];
                                    $frontCoverLikes = $frontCover['likes'];
                                    $backCoverLikes = $backCover['likes'];
                                    $frontCoverComments = $frontCover['comments'];
                                    $backCoverComments = $backCover['comments'];
                                    $frontCoverLikeStatus = $frontCover['likestatus'];
                                    $backCoverLikeStatus = $backCover['likestatus'];
                                    ?>
                                    <div id="image_url_l_0" class="hard image_url_0" data-likestatus ="<?= $frontCoverLikeStatus ?>" data-comments="<?= $frontCoverComments ?>" data-likes= "<?= $frontCoverLikes ?>" data-spreadid ="<?= $frontCoverSpreadId; ?>" style="background-image:url(<?= $frontCoverThumbUrl ?>);background-size: cover;">
                                        <div id="loadingThmubs" style=" right: 42%;">
                                            <!--<img id="loading-thumbs" src="https://imgd.photogurus.com/assets/preview/images/loading2.gif" alt="Loading..." /> -->
                                        </div>
                                        <div class="likeBox">
                                            <div class="clearfix top-row">
                                                <div class="pull-left">
                                                    Like<span class="likeCount">(0)</span>
                                                </div>
                                                <div class="pull-right">
                                                    <i class="likeButton"></i>
                                                    <i class="closeBtn closeBtnLike"></i>
                                                </div>
                                            </div>
                                            <div class="other-rows-likes" data-mcs-theme="dark"></div>
                                        </div>
                                        <div class="commentsBox">
                                            <div class="clearfix top-row">
                                                <div class="pull-left">
                                                    Comments<span class="CommentsCount">(0)</span>
                                                </div>
                                                <div class="pull-right">
                                                    <i class="closeBtnComments closeBtn"></i>
                                                </div>
                                            </div>
                                            <div class="other-rows-comments" data-mcs-theme="dark"></div>
                                            <div class="comment-section">
                                                <input type="text" class="form-control send-comment" placeholder="Write a comment.....">
                                            </div>
                                        </div>
                                    </div>  
                                    <?php
                                    $imgIterator = 1;
                                    foreach ($imagdetails as $imageDetail) {
                                        $spreadUrl = $imageDetail['thumb_url'];
                                        ?>
                                        <div class="hard image_url_<?= $imgIterator ?>" id="image_url_l_<?= $imgIterator ?>" data-likestatus ="<?= $imageDetail['likestatus'] ?>" data-comments="<?= $imageDetail['comments'] ?>" data-likes= "<?= $imageDetail['likes'] ?>" data-spreadid ="<?= $imageDetail['spread_id']; ?>" style="background-image:url('<?= $spreadUrl ?>');background-size: cover;">
                                            <div id="loadingThmubs">
                                                <!--<img id="loading-thumbs" src="https://imgd.photogurus.com/assets/preview/images/loading2.gif" alt="Loading..." />-->
                                            </div>
                                            <div class="prevControl controls">
                                                <img src="" >
                                            </div>


                                        </div>

                                        <div class="hard image_url_<?= $imgIterator ?>" id="image_url_r_<?= $imgIterator ?>"  data-likestatus ="<?= $imageDetail['likestatus'] ?>" data-comments="<?= $imageDetail['comments'] ?>" data-likes= "<?= $imageDetail['likes'] ?>" data-spreadid ="<?= $imageDetail['spread_id']; ?>" style="background-image:url('<?= $spreadUrl ?>');background-position: right center;background-size: cover;">

                                            <div class="nextControl controls">
                                                <img src="" >
                                            </div>
                                            <div class="likeBox">
                                                <div class="clearfix top-row">
                                                    <div class="pull-left">
                                                        Like<span class="likeCount">(0)</span>
                                                    </div>
                                                    <div class="pull-right">
                                                        <i class="likeButton"></i>
                                                        <i class="closeBtn closeBtnLike"></i>
                                                    </div>
                                                </div>
                                                <div class="other-rows-likes"></div>
                                            </div>
                                            <div class="commentsBox">
                                                <div class="clearfix top-row">
                                                    <div class="pull-left">
                                                        Comments<span class="CommentsCount">(0)</span>
                                                    </div>
                                                    <div class="pull-right">
                                                        <i class="closeBtnComments closeBtn"></i>
                                                    </div>
                                                </div>
                                                <div class="other-rows-comments" data-mcs-theme="dark"></div>
                                                <div class="comment-section">
                                                    <input type="text" class="form-control send-comment" placeholder="Write a comment.....">
                                                </div>
                                            </div>
                                        </div>

                                        <?php
                                        $imgIterator++;
                                    }
                                    ?>
                                    <div id="image_url_<?= $imgIterator ?>" class="hard image_url_<?= $imgIterator ?> lastPage"  data-likestatus ="<?= $backCoverLikeStatus ?>" data-comments="<?= $backCoverComments ?>" data-likes= "<?= $backCoverLikes ?>" data-spreadid ="<?= $backCoverSpreadId; ?>" style="background-image:url(<?= $backCoverThumbUrl ?>);background-size: cover;">
                                        <div id="loadingThmubs" style=" right: 50%;">
                                            <img id="loading-thumbs" src="https://imgd.photogurus.com/assets/preview/images/loading2.gif" alt="Loading..." />
                                        </div>

                                        <div class="prevControl controls">
                                            <img src="" >
                                        </div>

                                    </div>

                                    <div id="backCoverContent" class="hard" style="background-color: #323232;" >
                                        <div class="feedback">
                                            <div class="feedback-all">
                                                <div class="story-text">
                                                    Like this story?<br />
                                                    Send us feedback.
                                                </div>
                                                <div class="feedback-icons">
                                                    <div class="good-feedback"></div>
                                                    <div class="ok-feedback"></div>
                                                    <div class="bad-feedback"></div>
                                                </div>
                                                <form id="form_good" class="dn feedback-forms">
                                                    <textarea row="4" placeholder="Tell us what you liked..."  autofocus></textarea>
                                                    <button type="button" class="btn" id="send_good">Send</button>
                                                </form>
                                                <form id="form_ok" class="dn feedback-forms">
                                                    <textarea row="4" placeholder="Tell us what you liked..."  autofocus></textarea>
                                                    <button type="button" class="btn" id="send_ok">Send</button>
                                                </form>
                                                <form id="form_bad"  class="dn feedback-forms">
                                                    <textarea row="4" placeholder="Tell us what you didn't like..."  autofocus></textarea>
                                                    <button type="button" class="btn" id="send_dislike">Send</button>
                                                </form>
                                                <div id="errorMessge" class="dn">
                                                    Please try again
                                                </div>
                                            </div>      
                                        </div>
                                        <div class="backCoverLikeAndComment">
                                            <div class="story-text">
                                                Like this story?<br />
                                                Let your friend know.
                                            </div>
                                            <div class="likeAndComments">
                                                <div class="like-container">
                                                    <i class="flipbook-like"></i>
                                                </div>
                                                <div class="comments-container">
                                                    <i class="flipbook-comments"></i>
                                                </div>
                                            </div>
                                        </div>



                                        <div style="" class="appInstalledOnce commonbackCover">
                                            <div class="linkLine h1h">Like this story? Share with friends</div>
                                            <div class=" row" style="margin-bottom: 20px;">
                                                <div class="col-md-6 text-right">
                                                    <a  class="facebookShareLink" >
                                                        <img src="" class="img-responsive" alt="facebook link"  class="linkIcon">
                                                    </a>
                                                </div>
                                                <div class="col-md-6 text-left">
                                                    <a  class="facebookShareLink" >
                                                        <span style="line-height: 2.5;">Facebook</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class=" row" style="margin-bottom: 20px;">
                                                <div class="col-md-6 text-right">
                                                    <a  id="copyContain" data-toggle="modal" data-target="#copyToClipboard"  >
                                                        <img src="" class="img-responsive" alt="attachment link" class="linkIcon" >
                                                    </a>
                                                </div>
                                                <div class="col-md-6 text-left">
                                                    <a  id="copyContain" data-toggle="modal" data-target="#copyToClipboard"  >
                                                        <span style="line-height: 2.5;">Copy Link</span>  </a>
                                                    </a>
                                                </div>
                                            </div>
                                          <div class=" row" style="margin-bottom: 20px;">
                                                <div class="col-md-6 text-right">
                                                    <a  class="emailShareLink" >
                                                        <img src="" class="img-responsive" alt="mail link" class="linkIcon">
                                                    </a>
                                                </div>
                                                <div class="col-md-6 text-left">
                                                    <a  class="emailShareLink" style="width: 138px;">
                                                        <span style="line-height: 2.5;">Email Share </span>
                                                    </a>
                                                </div>
                                            </div>
                                            <!--div class="iconContainer">
                                                <a id="copyContain" data-toggle="modal" data-target="#copyToClipboard"  >
                                                    <img src="..../assets/images/icon_link.png" class="img-responsive" alt="attachment link" class="linkIcon" >
                                                    <span>Copy Link</span>  </a>

                                            </div>
                                            <div class="iconContainer">
                                                <a  class="emailShareLink" >
                                                    <div class="privateShareText">Private Share Requires Login</div>
                                                    <img src="..../assets/images/icon_mail.png" class="img-responsive" alt="mail link" class="linkIcon">
                                                </a>
                                            </div-->



                                        </div>
                                        <div style="" class="noAppInstatlled commonbackCover" style="display: none">
                                            <div class="linkLine">Story looks awesome in app.<br>
                                                Download on your device! </div>
                                            <div>
                                                <img id="googlePlayId" src="" alt="facebook link"  class="storelink">
                                                <img id="appleStoreId" src="" alt="mail link" class="storelink">
                                            </div>
                                            <div>
                                                <div class="outerPannel">
                                                    <div class="bubble ocperson" style="visibility: hidden">
                                                        Invalid Mobile Number
                                                    </div>
<!--                                                    <input type="text" name="Phone" id="phoneAndEmailId" placeholder="Email or Mobile number">-->
                                                    <input type="text" name="Phone" id="phoneAndEmailId" placeholder="Enter your email">
                                                    <div class="closeButton"></div>
                                                    <div class="clearIcon"></div>
                                                    <div class="loaderFor"></div>
                                                    <div class="primary_btn " id="getLink">Send link</div>

                                                </div>
                                            </div>
                                        </div>
                                        <div class="likeBox">
                                            <div class="clearfix top-row">
                                                <div class="pull-left">
                                                    Like<span class="likeCount">(0)</span>
                                                </div>
                                                <div class="pull-right">
                                                    <i class="likeButton"></i>
                                                    <i class="closeBtn closeBtnLike"></i>
                                                </div>
                                            </div>
                                            <div class="other-rows-likes" data-mcs-theme="dark"></div>
                                        </div>
                                        <div class="commentsBox">
                                            <div class="clearfix top-row">
                                                <div class="pull-left">
                                                    Comments<span class="CommentsCount">(0)</span>
                                                </div>
                                                <div class="pull-right">
                                                    <i class="closeBtnComments closeBtn"></i>
                                                </div>
                                            </div>
                                            <div class="other-rows-comments" data-mcs-theme="dark"></div>
                                            <div class="comment-section">
                                                <input type="text" class="form-control send-comment" placeholder="Write a comment.....">
                                            </div>
                                        </div>
                                        <div style="" class="privateStory commonbackCover">
                                            <div class="likeStory">Like this story ? </div>
                                            <div class="primary_btn makeYourStory" id="makeYourStory"><a href="<?= $pathToFreeStories ?>" >Make your photo story now !</a></div>

                                        </div>
                                        <div  class="mobileAndIpadOwnPrivateAndPublicLoggedIn commonbackCover">
                                            <div class="likeStory">Looks awesome in app </div>
                                            <a href="" id="downloadPath" > <div class="primary_btn makeYourStory" id="donwload_now">Download Now</div></a>


                                        </div>
                                        <div style="" class="publicSharedStoryLoggedIn commonbackCover">
                                            <div class="likeStory">Like this story ? </div>
                                            <div class="primary_btn makeYourStory" id="makeYourStory"><a href="<?= $pathToFreeStories ?>" >Make your photo story now !</a></div>
                                        </div>
                                        <div style="" class="publicSharedStoryNotLoggedIn commonbackCover">
                                            <div class="storyCreated">This photo story was created by</div>
                                            <img src="" alt="attachment link" class="logoBig">
                                            <div class="primary_btn makeYourStory" id="getYourPhotoStory"><a href="<?= $pathToFreeStories ?>" >Get your photo stories for free</a></div>
                                            <div class="youDoText">You do nothing. We do everything.</div>
                                        </div>
                                        <!--<img src="../assets/images/icon_logo.png" alt="attachment link" class="bottomLogoLink">-->
                                        <div class="spriteCode bottomLogoLink"></div>
                                    </div>

                                </div>

                                <div class="dFrontNextControl DFrontControl">
                                    <!--<img src="../assets/images/rightArrow.png" >-->
                                    <div class="spriteCode rightArrowDesk"></div>
                                </div>
                                <div class="flip-control right">
                                    <!--<a > </a>-->
                                    <div id="next" class="spriteCode rightArrowInnerSpreadDesk"></div>
                                    <!--<a id="frontCoverArrow"> </a>-->
                                </div>

                                <!--div class="flipbook-bottom">
                                    <div class="pull-left">
                                          <?php if ($userLoggedIn == 1 && $sharedStatus == 1000) { ?>
									        <div class="flip-control-bottom-actions">
                                                 <a href="<?=$zuluUrl.$orderId.'&consumer=yes&token='.$authToken?>">
                                                     <div class="spriteCode edit-icon"></div>
                                                </a>
                                             </div>
                                             <?php } ?>
                                                    <i class="flipbook-share"></i>
                                                    <i class="flipbook-print"></i>
                                            </div>
                                             <div class="pull-right likeAndComments">
                                                   <div class="like-container">
                                                       <i class="flipbook-like"></i>
                                                       <span class="like-count"></span>
                                                   </div>
                                                   <div class="comments-container">
                                                         <i class="flipbook-comments"></i>
                                                         <span class="comments-count"></span>
                                                </div>
                                             </div>
                                      </div>

                                <!--                                <div class="flip-control"
                                                                     <a id="frontCoverArrow"> </a>
                                                                </div>-->
                            </div-->

                        </div>
                        <div class="clearfix" ></div>
                        <!-- Hidden images for image caching-->
                        <div id="hiddenImagesGroup">
                            <img hidden src="" id="hidden_image_url_l_0">


                            <?php
                            $imgIterator = 1;
                            foreach ($imagdetails as $imageDetail) {
                                ?>
                                <img hidden src="" id="hidden_image_url_l_<?= $imgIterator ?>">
                                <?php
                                $imgIterator++;
                            }
                            ?>
                            <img hidden src="" id="hidden_image_url_l_<?= $imgIterator ?>">

                        </div>

                         <?php if ($userLoggedIn == 1 && $sharedStatus == 1000) { ?>
                        <!-- bottom tray with action button -->
                          <div class="bottomActionBtnContainer flipbook-bottom">
                               <!--<div class="spriteCode spreadShareIcon"></div>-->
                            
                            <div class="spriteCode spreadPrintIcon"></div>   

                             <a href="<?=$zuluUrl.$orderId.'&consumer=yes&token='.$authToken?>">
                                        <div class="spriteCode spreadEditIcon"></div>
                                        </a>                        
                            <!--<div class="spriteCode spreadInfoIcon"></div>-->
                            </div>
                             <?php } ?>
                             <?php if (($userLoggedIn == 1 && $sharedStatus == 8001) ||$userLoggedIn == 0) { ?>
                                <div class="bottomActionBtnContainer flipbook-bottom">
                                     <div class="spriteCode spreadPrintIcon"></div> 
                                 </div> 
                             <?php } ?>
                        <!-- bottom tray for web desktops -->
                        <div class="trayOutterBlock" style="position: fixed;margin: 0 auto;left: 0;right: 0;">
                            <div class="arrowContainLeft" style="">
                                <!--<img id="leftArrowTray" src="../assets/images/leftArrowTray.png" alt="slide to left" />-->
                                <div id="leftArrowTray"  class="spriteCode leftArrowIconPos"></div>
                            </div>
                          
                            <div class="bottomTrayContainer">

                                <div class="bottomTrayInnerContainer">
                                    <?php
                                    $i = 1;
                                    ?>
                                    <div class="flipbookWell coverImages c<?= $i ?>" data-value="1" style="background-image:url(<?= $frontCoverThumbUrl ?>);"></div>
                                    <?php
                                    foreach ($imagdetails as $imageDetail) {
                                        $spreadThumbUrl = $imageDetail['thumb_url'];
                                        $i = $i + 2;
                                        ?>
                                        <div class="flipbookWell wells c<?= $i ?> c<?= $i - 1 ?>" data-value=<?= $i ?> style="background-image:url(<?= $spreadThumbUrl ?>);"></div>

                                        <?php
                                    }
                                    $i = $i + 1;
                                    ?>
                                    <div class="flipbookWell coverImages c<?= $i ?>" data-value=<?= $i ?> style="background-image:url(<?= $backCoverThumbUrl ?>);"></div>
                                </div>
                            </div>
                            <div class="arrowContainRight" >
                                <!--<img id="rightArrowTray" src="../assets/images/rightArrowTray.png" alt="slide to right" />-->
                                <div id="rightArrowTray"  class="spriteCode rightArrowIconPos"></div>
                            </div>
                        </div>
                        <div class="warning-icon-div show-warning">
                            <img src="" class="warning-icon">
                        </div>
                        <div class="show-warning">
                            <div class="warning-msg-div">
                                <div id="warning_msg">
                                    <!--<div>Turn your device sideways<div> to view the story better.</div>-->
                                    <div>Turn your device sideways to<br> view the story in fullscreen.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="show-warning-no-images">
                        <div class="warning-icon-div-no-images">
                            <img src="" class="warning-icon-no-images">
                        </div>
                        <div class="warning-msg-div-no-images">
                            <span id="warning_msg_no_images">
                                This share has been deleted. If you want to view this story, please ask your friend to reshare with you.
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Modal -->
            <div id="copyToClipboard" class="modal fade" role="dialog">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content" style="padding: 15px;">
                        <!--<div class="modal-header">-->
                        <!--<button type="button" class="close " data-dismiss="modal">&times;</button>-->
                        <h4 class="modal-title">Copy link of photostory</h4>
                        <!--</div>-->
                        <div class="modal-body" style="padding: 0px;">
                            <input type="text" name="copyLink" value="copy link will be here" class="js-copytext" readonly>
                        </div>
                        <!--<div class="modal-footer">-->
                        <div class="modelCloseBtn" data-dismiss="modal">Close</div>
                        <div class="js-textareacopybtn  primary_btn"  >Copy to clipboard</div>
                        <!--</div>-->
                    </div>

                </div>
            </div>


            <!--                    <div class="CopyLinkInnerContainer">  Below Inner Copy Link Wraper Start Here
                                    <div class="fluid CopyLink_Title">Copy link of photostory <span id="albumnamespan"></span> </div>
                                    <div class="fluid CopyLinkTextBoxWraper">  Below Copy Link Row Wraper Start Here
                                        <div class="fluid CopyLinkTextBoxInnerWraper">
                                            <span id="cplinkspan">http://www.photogurus.com/?page=preview_share&token=54bd33046d25a </span>
                                        </div>
                                    </div>  Above Copy Link Row Wraper End Here
                                    <div class="fluid CopyLinkBotonsWraper">
                                        <input class="CopyCloseBT" id="copylinkclose" type="button" value="Close" >
                                        <input class="CopyClipordBT" id="copylinkbutton" type="button" value="Copy to clipboard" >
                                        <script src="js/copylink/ZeroClipboard.js"></script>
                                        <script type="text/javascript">
                        ZeroClipboard.config({moviePath: 'js/copylink/ZeroClipboard.swf'});
                        var client = new ZeroClipboard($("#copylinkbutton"));

                        client.on('load', function (client) {
                            client.on('datarequested', function (client) {
                                var text = $('#cplinkspan').text();
                                client.setText(text);
                            });
                            // callback triggered on successful copying
                            client.on('complete', function (client, args) {
                                //console.log("Text copied to clipboard: \n" + args.text );
                                alert('Photostory link is copied to clipboard');
                            });
                        });
                        // In case of error - such as Flash not being available
                        client.on('wrongflash noflash', function () {
                            ZeroClipboard.destroy();
                        });

                                        </script>
                                    </div>
                                </div>-->
            <div id="messageModalFlipbook" class="modal fade" role="dialog" data-backdrop="static">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4>Photogurus</h4>
                        </div>
                        <div class="modal-body text-center">
                            <p id="download_text">This functionality is only available on our app. Please download the app.</p>
                            <p style="display: none;" id="enter_comment">Please enter your comment</p>
                        </div>
                        <div class="modal-footer text-center">
                            <button type="button" class="btn btn-default" id="confirm_download_btn">Download</button>
                            <button type="button" class="btn btn-default"  id="cancelBtn" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-default" id="okBtn" style="display: none;"   data-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="messageModal" class="user-region-modal modal fade" role="dialog" data-backdrop="static">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4>Photogurus</h4>
                        </div>
                        <div class="modal-body text-center">
                            <p id="user-region-modal-content">This functionality is only available on our app. Please download the app.</p>
                        </div>
                        <div class="modal-footer text-center">
                            <button type="button" class="btn btn-default splitter" id="user-region-modal-left-action" data-dismiss="modal">Download</button>
                            <button type="button" class="btn btn-default" id="user-region-modal-right-action" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="messageModal" class="modal fade alertDialog" role="dialog" data-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4>Photogurus</h4>
                        </div>
                        <div class="modal-body text-center">
                            <p id="displayText">[text to be replaced]</p>
                        </div>
                        <div class="modal-footer text-center">
                            <button type="button" class="btn btn-default closeCustomModal" data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                var images = new Array();
                var imagesThumb = new Array();
                $(document).ready(function () {
                        //            $("#wrapper").toggleClass("toggled");
                        $("#menu-toggle").click(function (e) {
                            e.preventDefault();
                            $("#wrapper").toggleClass("toggled");
                        });
                        $(".closeMenu").click(function (e) {
                            e.preventDefault();
                            $("#wrapper").toggleClass("toggled");
                        });
                     
                    <?php
                    $imagdetails = array_values($allImages);
                    foreach ($imagdetails as $key => $imagdetail) {
                        ?>
                                            images[<?= $key ?>] = "<?= $imagdetail['spread_url'] ?>";
                                            imagesThumb[<?= $key ?>] = "<?= $imagdetail['thumb_url'] ?>";
                    <?php }
                    ?>
            var pathTrac = window.location.href;
            if (pathTrac.indexOf('tracking_id=') > 0) {
                $('.noAppInstatlled').css('display', 'block');
            } else {

                $('.noAppInstatlled').css('display', 'none');
            }
            $('.noAppInstatlled').css('margin-top', ($('#backCoverContent').height() - $('.noAppInstatlled').height()) / 2 + 'px');
            

                });

            </script>

    </body>
</html>
